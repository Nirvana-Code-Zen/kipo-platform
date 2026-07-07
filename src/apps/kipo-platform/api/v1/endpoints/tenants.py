from dataclasses import asdict
from flask import Blueprint, request, jsonify
from tenant.execute import execute as tenant_execute
from tenant.commands import RegisterTenantCommand
from shared.exceptions import BusinessRuleViolation

tenants_bp = Blueprint("tenants", __name__, url_prefix="/api/v1/tenants")


@tenants_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    try:
        tenant = tenant_execute(RegisterTenantCommand(
            auth_id=data.get("auth_id", ""),
            tenant_name=data.get("tenant_name", ""),
            plan_type=data.get("plan_type", "free"),
            timezone=data.get("timezone", "UTC"),
            currency=data.get("currency", "MXN"),
            storage_quota_bytes=data.get("storage_quota_bytes", 5_368_709_120),
            features_enabled=tuple(data.get("features_enabled") or []),
        ))
        return jsonify(asdict(tenant)), 201
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400
