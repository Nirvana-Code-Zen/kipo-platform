from flask import jsonify, request, g

from . import invoices_bp
from . import invoice_requester
from shared.auth_decorators import require_auth
from invoice.commands import ListInvoicesQuery
from invoice.execute import execute as invoice_execute
from shared.providers import get_tenant_repo
from tenant.plan_catalog import entitlements_for


@invoices_bp.route("", methods=["GET"])
@require_auth
def list_invoices():
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    try:
        limit = int(request.args.get("limit", 20))
    except (TypeError, ValueError):
        limit = 20
    try:
        offset = int(request.args.get("offset", 0))
    except (TypeError, ValueError):
        offset = 0

    limit = max(1, min(limit, 50))
    offset = max(0, offset)

    entitlements = entitlements_for(tenant)

    invoices = invoice_execute(
        ListInvoicesQuery(
            schema_name=tenant.schema_name,
            limit=limit,
            offset=offset,
            history_months=entitlements.history_months,
        )
    )
    return jsonify([invoice_requester.serialize_invoice(inv) for inv in invoices]), 200
