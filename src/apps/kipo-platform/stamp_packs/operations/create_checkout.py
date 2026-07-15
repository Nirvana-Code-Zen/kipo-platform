from shared.payment_gateway import IPaymentGateway
from shared.exceptions import BusinessRuleViolation
from stamp_packs.catalog import STAMP_PACK_CATALOG


def execute(
    gateway: IPaymentGateway,
    raw_tenant_id: str,
    tenant_email: str,
    pack_id: str,
    success_url: str,
    cancel_url: str,
) -> str:
    pack = STAMP_PACK_CATALOG.get(pack_id)
    if not pack:
        raise BusinessRuleViolation(f"'{pack_id}' is not a valid stamp pack.")

    customer_id = gateway.get_or_create_customer(raw_tenant_id, tenant_email)
    amount_cents = round(pack["qty"] * pack["unit_price"] * 100)

    return gateway.create_one_time_checkout_session(
        customer_id,
        amount_cents,
        "mxn",
        f"{pack['qty']} timbres CFDI",
        {"tenant_id": raw_tenant_id, "pack_id": pack_id, "qty": str(pack["qty"])},
        success_url,
        cancel_url,
    )
