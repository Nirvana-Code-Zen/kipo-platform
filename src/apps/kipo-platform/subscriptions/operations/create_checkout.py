from subscriptions.repository import ISubscriptionRepository
from shared.payment_gateway import IPaymentGateway
from subscriptions.subscription import Subscription
from subscriptions.value_objects.subscription_status import SubscriptionStatus
from tenant.value_objects.tenant_id import TenantId
from tenant.plan_catalog import PLAN_CATALOG
from shared.exceptions import BusinessRuleViolation


def execute(
    repo: ISubscriptionRepository,
    gateway: IPaymentGateway,
    raw_tenant_id: str,
    tenant_email: str,
    tier: str,
    success_url: str,
    cancel_url: str,
) -> str:
    plan = PLAN_CATALOG.get(tier)
    if not plan or not plan["stripe_price_id"]:
        raise BusinessRuleViolation(f"'{tier}' is not a self-serve plan.")

    tenant_id = TenantId(raw_tenant_id)
    existing = repo.find_by_tenant_id(tenant_id)
    customer_id = (
        existing.stripe_customer_id
        if existing
        else gateway.get_or_create_customer(str(tenant_id), tenant_email)
    )

    checkout_url = gateway.create_checkout_session(
        customer_id, plan["stripe_price_id"], success_url, cancel_url
    )

    repo.save(
        Subscription(
            tenant_id=tenant_id,
            tier=tier,
            stripe_customer_id=customer_id,
            stripe_subscription_id=existing.stripe_subscription_id if existing else None,
            status=existing.status if existing else SubscriptionStatus.TRIALING,
            current_period_end=existing.current_period_end if existing else None,
        )
    )
    return checkout_url
