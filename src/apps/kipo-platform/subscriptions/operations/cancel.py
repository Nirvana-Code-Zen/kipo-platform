from subscriptions.repository import ISubscriptionRepository
from shared.payment_gateway import IPaymentGateway
from tenant.value_objects.tenant_id import TenantId
from shared.exceptions import BusinessRuleViolation


def execute(
    repo: ISubscriptionRepository,
    gateway: IPaymentGateway,
    raw_tenant_id: str,
) -> None:
    tenant_id = TenantId(raw_tenant_id)
    existing = repo.find_by_tenant_id(tenant_id)
    if existing is None or existing.stripe_subscription_id is None:
        raise BusinessRuleViolation("Tenant has no active subscription to cancel.")

    gateway.cancel_subscription(existing.stripe_subscription_id)
