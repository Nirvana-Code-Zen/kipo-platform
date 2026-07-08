from uuid import uuid4
from invoice.repository import IInvoiceRepository
from invoice.invoice import Invoice
from invoice.invoice_concept import InvoiceConcept


def execute(
    repo: IInvoiceRepository,
    schema_name: str,
    voucher_type: str,
    series: str | None,
    payment_method: str,
    payment_form: str,
    currency: str,
    export_type: str,
    issuer_zip: str,
    receiver_tax_id: str,
    receiver_name: str,
    receiver_zip: str | None,
    raw_concepts: list[dict],
) -> Invoice:
    invoice_id = str(uuid4())
    concepts: list[InvoiceConcept] = []
    subtotal = 0.0
    iva = 0.0
    for ordinal, raw in enumerate(raw_concepts):
        quantity = float(raw["quantity"])
        unit_price = float(raw["unit_price"])
        tax_object = raw.get("tax_object", "02")
        iva_rate = raw.get("iva_rate")
        iva_rate = float(iva_rate) if iva_rate is not None else None
        amount = round(quantity * unit_price, 2)
        iva_amount = (
            round(amount * iva_rate / 100, 2)
            if tax_object == "02" and iva_rate is not None
            else 0.0
        )
        subtotal += amount
        iva += iva_amount
        concepts.append(
            InvoiceConcept(
                id=str(uuid4()),
                invoice_id=invoice_id,
                product_service_code=raw["product_service_code"],
                unit_code=raw["unit_code"],
                description=raw["description"],
                quantity=quantity,
                unit_price=unit_price,
                amount=amount,
                tax_object=tax_object,
                iva_rate=iva_rate,
                iva_amount=iva_amount,
                ordinal=ordinal,
            )
        )
    subtotal = round(subtotal, 2)
    iva = round(iva, 2)
    total = round(subtotal + iva, 2)
    invoice = Invoice(
        id=invoice_id,
        series=series,
        folio="",
        voucher_type=voucher_type,
        payment_method=payment_method,
        payment_form=payment_form,
        currency=currency,
        export_type=export_type,
        issuer_zip=issuer_zip,
        receiver_tax_id=receiver_tax_id,
        receiver_name=receiver_name,
        receiver_zip=receiver_zip,
        subtotal=subtotal,
        iva=iva,
        total=total,
        status="stamped",
        concepts=concepts,
        created_at="",
    )
    return repo.save(invoice, schema_name)
