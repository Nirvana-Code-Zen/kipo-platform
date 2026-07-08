from flask import Blueprint, request, jsonify
from tenant.execute import execute as tenant_execute
from tenant.commands import RegisterTenantCommand
from shared.exceptions import BusinessRuleViolation
from shared.supabase import get_client

tenants_bp = Blueprint("tenants", __name__, url_prefix="/api/v1/tenants")


def _require_user_id() -> tuple[str, None] | tuple[None, tuple]:
    token = request.headers.get("Authorization", "").removeprefix("Bearer ").strip()
    if not token:
        return None, (jsonify({"error": "Unauthorized"}), 401)
    try:
        user = get_client().auth.get_user(token)
        return str(user.user.id), None
    except Exception:
        return None, (jsonify({"error": "Invalid or expired token"}), 401)


@tenants_bp.route("/register", methods=["POST"])
def register():
    auth_id, error = _require_user_id()
    if error:
        return error

    data = request.get_json() or {}
    try:
        tenant = tenant_execute(RegisterTenantCommand(
            auth_id=auth_id,
            name=data.get("name", ""),
            schema_name=data.get("schema_name", ""),
            plan_type=data.get("plan_type", "free"),
            timezone=data.get("timezone", "America/Mexico_City"),
            currency=data.get("currency", "MXN"),
            storage_quota_bytes=data.get("storage_quota_bytes", 5_368_709_120),
            features_enabled=tuple(data.get("features_enabled") or []),
        ))
        return jsonify({
            "tenant_id": str(tenant.id),
            "name": tenant.name,
            "schema_name": tenant.schema_name,
            "plan_type": tenant.plan_type.value,
            "status": tenant.status.value,
            "timezone": tenant.timezone,
            "currency": tenant.currency,
        }), 201
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400
