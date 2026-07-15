from supabase import Client
from subscriptions.repository import ISubscriptionRepository
from subscriptions.subscription import Subscription
from subscriptions.value_objects.subscription_status import SubscriptionStatus
from tenant.value_objects.tenant_id import TenantId
from shared.db_admin import admin_connection

_COLUMNS = """
    tenant_id, tier, stripe_customer_id, stripe_subscription_id,
    status, current_period_end
"""


class SupabaseSubscriptionRepository(ISubscriptionRepository):
    def __init__(self, client: Client) -> None:
        self._client = client

    def save(self, subscription: Subscription) -> Subscription:
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    INSERT INTO public.subscriptions
                        ({_COLUMNS})
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (tenant_id) DO UPDATE SET
                        tier = EXCLUDED.tier,
                        stripe_customer_id = EXCLUDED.stripe_customer_id,
                        stripe_subscription_id = EXCLUDED.stripe_subscription_id,
                        status = EXCLUDED.status,
                        current_period_end = EXCLUDED.current_period_end,
                        updated_at = now()
                    """,
                    (
                        str(subscription.tenant_id),
                        subscription.tier,
                        subscription.stripe_customer_id,
                        subscription.stripe_subscription_id,
                        subscription.status.value,
                        subscription.current_period_end,
                    ),
                )
            conn.commit()
        return subscription

    def find_by_tenant_id(self, tenant_id: TenantId) -> Subscription | None:
        return self._find_by("tenant_id", str(tenant_id))

    def find_by_stripe_subscription_id(self, stripe_subscription_id: str) -> Subscription | None:
        return self._find_by("stripe_subscription_id", stripe_subscription_id)

    def find_by_stripe_customer_id(self, stripe_customer_id: str) -> Subscription | None:
        return self._find_by("stripe_customer_id", stripe_customer_id)

    def _find_by(self, column: str, value: str) -> Subscription | None:
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT {_COLUMNS} FROM public.subscriptions WHERE {column} = %s LIMIT 1",
                    (value,),
                )
                row = cur.fetchone()
        if not row:
            return None
        (
            tenant_id,
            tier,
            stripe_customer_id,
            stripe_subscription_id,
            status,
            current_period_end,
        ) = row
        return Subscription(
            tenant_id=TenantId(tenant_id),
            tier=tier,
            stripe_customer_id=stripe_customer_id,
            stripe_subscription_id=stripe_subscription_id,
            status=SubscriptionStatus(status),
            current_period_end=current_period_end,
        )
