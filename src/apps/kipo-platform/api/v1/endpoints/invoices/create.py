from flask import jsonify, request, g

from . import invoices_bp
from . import invoice_requester
from shared.auth_decorators import require_auth
from invoice.execute import execute as invoice_execute
from invoice.commands import CreateInvoiceCommand
from shared.exceptions import BusinessRuleViolation
from shared.providers import get_tenant_repo


@invoices_bp.route("", methods=["POST"])
@require_auth
def create_invoice():
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    data = request.get_json() or {}
    try:
        invoice = invoice_execute(
            CreateInvoiceCommand(
                schema_name=tenant.schema_name,
                voucher_type=data.get("voucher_type", ""),
                series=data.get("series"),
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
