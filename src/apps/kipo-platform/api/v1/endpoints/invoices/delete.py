from flask import jsonify, g

from . import invoices_bp
from shared.auth_decorators import require_auth
from invoice.execute import execute as invoice_execute
from invoice.commands import DeleteInvoiceCommand
from shared.exceptions import NotFound
from shared.providers import get_tenant_repo

@invoices_bp.route("/<invoice_id>", methods=["DELETE"])
@require_auth
def delete_invoice(invoice_id: str):
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    try:
        invoice_execute(
            DeleteInvoiceCommand(
                schema_name=tenant.schema_name,
                invoice_id=invoice_id,
            )
        )
        return jsonify({"ok": True}), 200
    except NotFound as err:
        return jsonify({"error": str(err)}), 404
