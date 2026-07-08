import json
from flask import Blueprint, request, jsonify, g
from shared.auth_decorators import require_auth
from shared.db_admin import admin_connection
from shared.providers import get_tenant_repo
from invoice.execute import execute as invoice_execute
from customer.execute import execute as customer_execute
from invoice.commands import GetInvoiceDashboardStatsQuery, GetBillingActivityQuery, ListInvoicesQuery
from customer.commands import ListCustomersQuery

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/v1/dashboard")


@dashboard_bp.route("/summary", methods=["GET"])
@require_auth
def dashboard_summary():
    user_id = g.user_id
    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    schema_name = tenant.schema_name

    stats = invoice_execute(GetInvoiceDashboardStatsQuery(schema_name=schema_name))

    with admin_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT stamps FROM public.tenants WHERE schema_name = %s",
                (schema_name,),
            )
            row = cur.fetchone()
            available_stamps = int(row[0]) if row else 0

    stamps = {"available": available_stamps, "stamped": stats["stamped"]}

    invoices = invoice_execute(ListInvoicesQuery(schema_name=schema_name, limit=5, offset=0))
    recent_invoices = []
    for inv in invoices:
        receiver = inv.receiver if isinstance(inv.receiver, dict) else json.loads(inv.receiver)
        recent_invoices.append({
            "id": inv.id,
            "folio": inv.folio,
            "receiver_name": receiver.get("name", ""),
            "total": inv.total,
            "status": inv.status,
            "created_at": inv.created_at,
        })

    customers = customer_execute(ListCustomersQuery(schema_name=schema_name, limit=4, offset=0))
    recent_clients = [
        {
            "id": str(c.id),
            "tax_id": str(c.tax_id),
            "legal_name": str(c.legal_name),
            "email": c.email,
            "status": "active" if c.is_active else "inactive",
            "avatar_url": c.avatar_url,
        }
        for c in customers
    ]

    return jsonify({
        "stats": stats,
        "stamps": stamps,
        "recent_invoices": recent_invoices,
        "recent_clients": recent_clients,
    }), 200


@dashboard_bp.route("/billing-activity", methods=["GET"])
@require_auth
def billing_activity():
    user_id = g.user_id
    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    view = request.args.get("view", "current_week")
    week_start = request.args.get("week_start")

    data = invoice_execute(GetBillingActivityQuery(
        schema_name=tenant.schema_name,
        view=view,
        week_start=week_start,
    ))
    return jsonify(data), 200
