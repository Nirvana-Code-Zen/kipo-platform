from flask import Blueprint, request, jsonify
from customer.execute import execute as customer_execute
from customer.commands import CreateCustomerCommand
from shared.exceptions import BusinessRuleViolation
from shared.supabase import get_client
from shared.providers import get_tenant_repo

customers_bp = Blueprint("customers", __name__, url_prefix="/api/v1/customers")


def _require_user_id() -> tuple[str, None] | tuple[None, tuple]:
    token = request.headers.get("Authorization", "").removeprefix("Bearer ").strip()
    if not token:
        return None, (jsonify({"error": "Unauthorized"}), 401)
    try:
        user = get_client().auth.get_user(token)
        return str(user.user.id), None
    except Exception:
        return None, (jsonify({"error": "Invalid or expired token"}), 401)


@customers_bp.route("", methods=["POST"])
def create_customer():
    user_id, error = _require_user_id()
    if error:
        return error

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    data = request.get_json() or {}
    try:
        customer = customer_execute(CreateCustomerCommand(
            schema_name=tenant.schema_name,
            tax_id=data.get("tax_id", ""),
            legal_name=data.get("legal_name", ""),
            tax_regime=data.get("tax_regime", ""),
            zip=data.get("zip", ""),
            cfdi_use=data.get("cfdi_use", ""),
            email=data.get("email", ""),
            avatar_url=data.get("avatar_url"),
        ))
        return jsonify({
            "id": str(customer.id),
            "tax_id": str(customer.tax_id),
            "legal_name": str(customer.legal_name),
            "tax_regime": str(customer.tax_regime),
            "zip": str(customer.zip),
            "cfdi_use": str(customer.cfdi_use),
            "email": customer.email,
            "is_active": customer.is_active,
            "avatar_url": customer.avatar_url,
        }), 201
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400
