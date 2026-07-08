from dataclasses import dataclass
from invoice.invoice_concept import InvoiceConcept


@dataclass(frozen=True)
class Invoice:
    id: str
    series: str | None
    folio: str
    voucher_type: str
    payment_method: str
    payment_form: str
    currency: str
    export_type: str
    issuer_zip: str
    customer_id: str | None
    receiver: dict
    subtotal: float
    iva: float
    total: float
    status: str
    concepts: list[InvoiceConcept]
    created_at: str
