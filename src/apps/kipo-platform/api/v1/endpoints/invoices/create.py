import re

from flask import jsonify, request, g

from . import invoices_bp
from . import invoice_requester
from shared.auth_decorators import require_auth
from invoice.execute import execute as invoice_execute
from invoice.commands import CreateInvoiceCommand
from shared.exceptions import BusinessRuleViolation
from shared.providers import get_tenant_repo

_RFC_REGEX = re.compile(r'^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$')


@invoices_bp.route("", methods=["POST"])
@require_auth
def create_invoice():
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    data = request.get_json() or {}

    receiver = data.get("receiver", {})
    tax_id = receiver.get("tax_id", "").strip().upper()
    zip_code = receiver.get("zip", "").strip()
    if not _RFC_REGEX.match(tax_id):
        return jsonify({"error": "RFC del receptor inválido"}), 400
    if not re.match(r'^\d{5}$', zip_code):
        return jsonify({"error": "C.P. del receptor requerido (5 dígitos)"}), 400

    try:
        invoice = invoice_execute(
            CreateInvoiceCommand(
                schema_name=tenant.schema_name,
                voucher_type=data.get("voucher_type", ""),
                payment_method=data.get("payment_method", ""),
                payment_form=data.get("payment_form", ""),
                currency=data.get("currency", "MXN"),
                export_type=data.get("export_type", "01"),
                issuer_zip=data.get("issuer_zip", ""),
                customer_id=data.get("customer_id"),
                receiver=data.get("receiver", {}),
                concepts=data.get("concepts", []),
            )
        )
        return jsonify(invoice_requester.serialize_invoice(invoice)), 201
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400
