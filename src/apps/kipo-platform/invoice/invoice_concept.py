from dataclasses import dataclass


@dataclass(frozen=True)
class InvoiceConcept:
    id: str
    invoice_id: str
    product_service_code: str
    unit_code: str
    description: str
    quantity: float
    unit_price: float
    amount: float
    tax_object: str
    iva_rate: float | None
    iva_amount: float
    ordinal: int
