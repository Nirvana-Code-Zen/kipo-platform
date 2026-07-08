def serialize_invoice(invoice) -> dict:
    return {
        "id": invoice.id,
        "folio": invoice.folio,
        "voucher_type": invoice.voucher_type,
        "payment_method": invoice.payment_method,
        "payment_form": invoice.payment_form,
        "currency": invoice.currency,
        "series": invoice.series,
        "status": invoice.status,
        "issuer_zip": invoice.issuer_zip,
        "receiver_tax_id": invoice.receiver_tax_id,
        "receiver_name": invoice.receiver_name,
        "receiver_zip": invoice.receiver_zip,
        "subtotal": invoice.subtotal,
        "iva": invoice.iva,
        "total": invoice.total,
        "created_at": invoice.created_at,
        "concepts": [
            {
                "id": c.id,
                "product_service_code": c.product_service_code,
                "unit_code": c.unit_code,
                "description": c.description,
                "quantity": c.quantity,
                "unit_price": c.unit_price,
                "amount": c.amount,
                "tax_object": c.tax_object,
                "iva_rate": c.iva_rate,
                "iva_amount": c.iva_amount,
            }
            for c in invoice.concepts
        ],
    }
