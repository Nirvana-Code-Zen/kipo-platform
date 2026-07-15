import stripe

from shared.payment_gateway import IPaymentGateway


class StripePaymentGateway(IPaymentGateway):
    """Only file that imports the Stripe SDK — swap this adapter to change
    payment providers without touching any domain."""

    def __init__(self, secret_key: str) -> None:
        self._client = stripe.StripeClient(secret_key)

    def get_or_create_customer(self, tenant_id: str, email: str) -> str:
        existing = self._client.v1.customers.search(
            {"query": f"metadata['tenant_id']:'{tenant_id}'"}
        )
        if existing.data:
            return existing.data[0].id

        customer = self._client.v1.customers.create(
            {"email": email, "metadata": {"tenant_id": tenant_id}}
        )
        return customer.id

    def create_checkout_session(
        self, customer_id: str, price_id: str, success_url: str, cancel_url: str
    ) -> str:
        session = self._client.v1.checkout.sessions.create(
            {
                "customer": customer_id,
                "mode": "subscription",
                "line_items": [{"price": price_id, "quantity": 1}],
                "success_url": success_url,
                "cancel_url": cancel_url,
            }
        )
        return session.url

    def create_one_time_checkout_session(
        self,
        customer_id: str,
        amount_cents: int,
        currency: str,
        product_name: str,
        metadata: dict[str, str],
        success_url: str,
        cancel_url: str,
    ) -> str:
        session = self._client.v1.checkout.sessions.create(
            {
                "customer": customer_id,
                "mode": "payment",
                "line_items": [
                    {
                        "price_data": {
                            "currency": currency,
                            "product_data": {"name": product_name},
                            "unit_amount": amount_cents,
                        },
                        "quantity": 1,
                    }
                ],
                "metadata": metadata,
                "success_url": success_url,
                "cancel_url": cancel_url,
            }
        )
        return session.url

    def verify_webhook(self, payload: bytes, signature: str, webhook_secret: str) -> dict:
        event = stripe.Webhook.construct_event(payload, signature, webhook_secret)
        return event

    def cancel_subscription(self, stripe_subscription_id: str) -> None:
        self._client.v1.subscriptions.cancel(stripe_subscription_id)
