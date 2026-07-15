from dataclasses import dataclass


@dataclass(frozen=True)
class CreateStampCheckoutCommand:
    tenant_id: str
    tenant_email: str
    pack_id: str
    success_url: str
    cancel_url: str


@dataclass(frozen=True)
class SyncStampPurchaseWebhookCommand:
    payload: bytes
    signature: str
    webhook_secret: str
