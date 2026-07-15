from typing import Any
from stamp_packs.commands import CreateStampCheckoutCommand, SyncStampPurchaseWebhookCommand
from stamp_packs.operations import create_checkout, sync_from_webhook
from shared.providers import get_stamp_pack_repo, get_payment_gateway
from shared.exceptions import BusinessRuleViolation


def execute(command: Any) -> Any:
    gateway = get_payment_gateway()
    match command:
        case CreateStampCheckoutCommand(tenant_id, tenant_email, pack_id, success_url, cancel_url):
            return create_checkout.execute(
                gateway, tenant_id, tenant_email, pack_id, success_url, cancel_url
            )
        case SyncStampPurchaseWebhookCommand(payload, signature, webhook_secret):
            return sync_from_webhook.execute(
                get_stamp_pack_repo(), gateway, payload, signature, webhook_secret
            )
        case _:
            raise BusinessRuleViolation(f"Unknown stamp pack command: {type(command).__name__}")
