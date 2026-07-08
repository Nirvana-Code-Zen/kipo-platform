from flask import Blueprint, request, jsonify, g
from tenant.execute import execute as tenant_execute
from tenant.commands import RegisterTenantCommand
from shared.auth_decorators import require_auth
from shared.exceptions import BusinessRuleViolation

tenants_bp = Blueprint("tenants", __name__, url_prefix="/api/v1/tenants")

@tenants_bp.route("/register", methods=["POST"])
@require_auth
def register():
    auth_id, = g.user_id

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
