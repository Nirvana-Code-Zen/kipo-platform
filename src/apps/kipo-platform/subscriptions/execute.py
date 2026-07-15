from typing import Any
from subscriptions.commands import (
    CreateCheckoutSessionCommand,
    SyncFromStripeWebhookCommand,
    CancelSubscriptionCommand,
)
from subscriptions.operations import create_checkout, sync_from_webhook, cancel
from shared.providers import get_subscription_repo, get_payment_gateway
from shared.exceptions import BusinessRuleViolation


def execute(command: Any) -> Any:
    repo = get_subscription_repo()
    gateway = get_payment_gateway()
    match command:
        case CreateCheckoutSessionCommand(
            tenant_id, tenant_email, tier, success_url, cancel_url
        ):
            return create_checkout.execute(
                repo, gateway, tenant_id, tenant_email, tier, success_url, cancel_url
            )
        case SyncFromStripeWebhookCommand(payload, signature, webhook_secret):
            return sync_from_webhook.execute(repo, gateway, payload, signature, webhook_secret)
        case CancelSubscriptionCommand(tenant_id):
            return cancel.execute(repo, gateway, tenant_id)
        case _:
            raise BusinessRuleViolation(f"Unknown subscription command: {type(command).__name__}")
