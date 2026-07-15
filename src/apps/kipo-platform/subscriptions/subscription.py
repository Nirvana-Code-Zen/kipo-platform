from dataclasses import dataclass
from datetime import datetime

from tenant.value_objects.tenant_id import TenantId
from subscriptions.value_objects.subscription_status import SubscriptionStatus


@dataclass(frozen=True)
class Subscription:
    tenant_id: TenantId
    tier: str
    stripe_customer_id: str
    stripe_subscription_id: str | None
    status: SubscriptionStatus
    current_period_end: datetime | None


@dataclass(frozen=True)
class TenantPlanSync:
    """Result of reconciling a Stripe webhook event — what the tenant's
    plan_type/status/features_enabled should become."""

    tenant_id: str
    plan_type: str
    status: str
    features_enabled: tuple[str, ...]
