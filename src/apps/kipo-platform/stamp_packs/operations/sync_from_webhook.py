from stamp_packs.repository import IStampPackRepository
from shared.payment_gateway import IPaymentGateway


def execute(
    repo: IStampPackRepository,
    gateway: IPaymentGateway,
    payload: bytes,
    signature: str,
    webhook_secret: str,
) -> None:
    event = gateway.verify_webhook(payload, signature, webhook_secret)
    if event["type"] != "checkout.session.completed":
        return

    session = event["data"]["object"]
    if session.get("mode") != "payment" or session.get("payment_status") != "paid":
        return

    metadata = session.get("metadata") or {}
    tenant_id = metadata.get("tenant_id")
    pack_id = metadata.get("pack_id")
    qty = metadata.get("qty")
    if not tenant_id or not pack_id or not qty:
        return

    session_id = session["id"]
    if repo.has_processed(session_id):
        return

    repo.record_purchase(
        tenant_id=tenant_id,
        pack_id=pack_id,
        qty=int(qty),
        amount_cents=session["amount_total"],
        stripe_checkout_session_id=session_id,
    )
    repo.credit_stamps(tenant_id, int(qty))
