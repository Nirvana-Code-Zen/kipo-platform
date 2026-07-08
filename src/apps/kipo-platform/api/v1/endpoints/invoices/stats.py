from flask import jsonify, g

from . import invoices_bp
from shared.auth_decorators import require_auth
from invoice.execute import execute as invoice_execute
from invoice.commands import GetInvoiceStatsQuery
from shared.providers import get_tenant_repo
from shared.db_admin import admin_connection


@invoices_bp.route("/stats", methods=["GET"])
@require_auth
def invoice_stats():
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    stats = invoice_execute(GetInvoiceStatsQuery(schema_name=tenant.schema_name))

    with admin_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT stamps FROM public.tenants WHERE schema_name = %s",
                (tenant.schema_name,),
            )
            row = cur.fetchone()
            available_stamps = row[0] if row else 0

    stats["available_stamps"] = available_stamps
    return jsonify(stats), 200
