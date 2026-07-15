from dataclasses import dataclass


@dataclass(frozen=True)
class CreateCheckoutSessionCommand:
    tenant_id: str
    tenant_email: str
    tier: str
    success_url: str
    cancel_url: str


@dataclass(frozen=True)
class SyncFromStripeWebhookCommand:
    payload: bytes
    signature: str
    webhook_secret: str


@dataclass(frozen=True)
class CancelSubscriptionCommand:
    tenant_id: str
