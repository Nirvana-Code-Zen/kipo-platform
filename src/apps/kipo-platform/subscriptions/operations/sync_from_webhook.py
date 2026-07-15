from datetime import datetime, timezone

from subscriptions.repository import ISubscriptionRepository
from shared.payment_gateway import IPaymentGateway
from subscriptions.subscription import Subscription, TenantPlanSync
from subscriptions.value_objects.subscription_status import SubscriptionStatus
from tenant.value_objects.plan_type import PlanType
from tenant.value_objects.tenant_status import TenantStatus
from tenant.plan_catalog import PLAN_CATALOG, tier_for_price_id

_STRIPE_TO_TENANT_STATUS = {
    "trialing": TenantStatus.TRIAL,
    "active": TenantStatus.ACTIVE,
    "past_due": TenantStatus.SUSPENDED_BILLING,
    "unpaid": TenantStatus.SUSPENDED_BILLING,
    "canceled": TenantStatus.INACTIVE,
}

_STRIPE_TO_LOCAL_STATUS = {
    "trialing": SubscriptionStatus.TRIALING,
    "active": SubscriptionStatus.ACTIVE,
    "past_due": SubscriptionStatus.PAST_DUE,
    "unpaid": SubscriptionStatus.PAST_DUE,
    "canceled": SubscriptionStatus.CANCELED,
}


def execute(
    repo: ISubscriptionRepository,
    gateway: IPaymentGateway,
    payload: bytes,
    signature: str,
    webhook_secret: str,
) -> TenantPlanSync | None:
    event = gateway.verify_webhook(payload, signature, webhook_secret)
    event_type = event["type"]
    data = event["data"]["object"]

    if event_type in ("customer.subscription.created", "customer.subscription.updated"):
        return _sync_active_subscription(repo, data)
    if event_type == "customer.subscription.deleted":
        return _sync_canceled_subscription(repo, data)
    if event_type == "invoice.payment_failed":
        return _sync_payment_failed(repo, data)
    return None


def _sync_active_subscription(repo: ISubscriptionRepository, data: dict) -> TenantPlanSync | None:
    price_id = data["items"]["data"][0]["price"]["id"]
    tier = tier_for_price_id(price_id)
    if tier is None:
        return None

    existing = repo.find_by_stripe_customer_id(data["customer"])
    if existing is None:
        return None

    plan = PLAN_CATALOG[tier]
    stripe_status = data["status"]
    period_end = datetime.fromtimestamp(data["current_period_end"], tz=timezone.utc)

    repo.save(
        Subscription(
            tenant_id=existing.tenant_id,
            tier=tier,
            stripe_customer_id=existing.stripe_customer_id,
            stripe_subscription_id=data["id"],
            status=_STRIPE_TO_LOCAL_STATUS.get(stripe_status, SubscriptionStatus.ACTIVE),
            current_period_end=period_end,
        )
    )

    return TenantPlanSync(
        tenant_id=str(existing.tenant_id),
        plan_type=plan["plan_type"].value,
        status=_STRIPE_TO_TENANT_STATUS.get(stripe_status, TenantStatus.ACTIVE).value,
        features_enabled=plan["features"],
    )


def _sync_canceled_subscription(repo: ISubscriptionRepository, data: dict) -> TenantPlanSync | None:
    existing = repo.find_by_stripe_customer_id(data["customer"])
    if existing is None:
        return None

    repo.save(
        Subscription(
            tenant_id=existing.tenant_id,
            tier="basico",
            stripe_customer_id=existing.stripe_customer_id,
            stripe_subscription_id=existing.stripe_subscription_id,
            status=SubscriptionStatus.CANCELED,
            current_period_end=existing.current_period_end,
        )
    )

    return TenantPlanSync(
        tenant_id=str(existing.tenant_id),
        plan_type=PlanType.FREE.value,
        status=TenantStatus.ACTIVE.value,
        features_enabled=(),
    )


def _sync_payment_failed(repo: ISubscriptionRepository, data: dict) -> TenantPlanSync | None:
    stripe_subscription_id = data.get("subscription")
    if not stripe_subscription_id:
        return None

    existing = repo.find_by_stripe_subscription_id(stripe_subscription_id)
    if existing is None:
        return None

    plan = PLAN_CATALOG[existing.tier]

    repo.save(
        Subscription(
            tenant_id=existing.tenant_id,
            tier=existing.tier,
            stripe_customer_id=existing.stripe_customer_id,
            stripe_subscription_id=existing.stripe_subscription_id,
            status=SubscriptionStatus.PAST_DUE,
            current_period_end=existing.current_period_end,
        )
    )

    return TenantPlanSync(
        tenant_id=str(existing.tenant_id),
        plan_type=plan["plan_type"].value,
        status=TenantStatus.SUSPENDED_BILLING.value,
        features_enabled=plan["features"],
    )
