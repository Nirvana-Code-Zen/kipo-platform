from abc import ABC, abstractmethod


class IPaymentGateway(ABC):
    """Port for the payment provider that runs Kipo's own billing (subscriptions,
    stamp packs, ...). Which provider implements it (Stripe, Conekta, ...) is an
    infrastructure concern. Shared across domains — not specific to subscriptions."""

    @abstractmethod
    def get_or_create_customer(self, tenant_id: str, email: str) -> str: ...

    @abstractmethod
    def create_checkout_session(
        self, customer_id: str, price_id: str, success_url: str, cancel_url: str
    ) -> str: ...

    @abstractmethod
    def create_one_time_checkout_session(
        self,
        customer_id: str,
        amount_cents: int,
        currency: str,
        product_name: str,
        metadata: dict[str, str],
        success_url: str,
        cancel_url: str,
    ) -> str: ...

    @abstractmethod
    def verify_webhook(self, payload: bytes, signature: str, webhook_secret: str) -> dict: ...

    @abstractmethod
    def cancel_subscription(self, stripe_subscription_id: str) -> None: ...
