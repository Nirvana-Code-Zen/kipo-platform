from flask import Blueprint, request, jsonify
from customer.execute import execute as customer_execute
from customer.commands import (
    CreateCustomerCommand,
    UpdateCustomerCommand,
    DeactivateCustomerCommand,
    ActivateCustomerCommand,
    DeleteCustomerCommand,
    ListCustomersQuery,
)
from shared.exceptions import BusinessRuleViolation, NotFound
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


@customers_bp.route("/<customer_id>", methods=["PUT"])
def update_customer(customer_id: str):
    user_id, error = _require_user_id()
    if error:
        return error

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    data = request.get_json() or {}
    try:
        customer = customer_execute(UpdateCustomerCommand(
            schema_name=tenant.schema_name,
            customer_id=customer_id,
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
        }), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400
    except NotFound as err:
        return jsonify({"error": str(err)}), 404


@customers_bp.route("/<customer_id>", methods=["DELETE"])
def delete_customer(customer_id: str):
    user_id, error = _require_user_id()
    if error:
        return error

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    try:
        customer_execute(DeleteCustomerCommand(
            schema_name=tenant.schema_name,
            customer_id=customer_id,
        ))
        return jsonify({"ok": True}), 200
    except NotFound as err:
        return jsonify({"error": str(err)}), 404


@customers_bp.route("/<customer_id>/deactivate", methods=["POST"])
def deactivate_customer(customer_id: str):
    user_id, error = _require_user_id()
    if error:
        return error

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    try:
        customer_execute(DeactivateCustomerCommand(
            schema_name=tenant.schema_name,
            customer_id=customer_id,
        ))
        return jsonify({"ok": True}), 200
    except NotFound as err:
        return jsonify({"error": str(err)}), 404


@customers_bp.route("/<customer_id>/activate", methods=["POST"])
def activate_customer(customer_id: str):
    user_id, error = _require_user_id()
    if error:
        return error

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    try:
        customer_execute(ActivateCustomerCommand(
            schema_name=tenant.schema_name,
            customer_id=customer_id,
        ))
        return jsonify({"ok": True}), 200
    except NotFound as err:
        return jsonify({"error": str(err)}), 404


@customers_bp.route("", methods=["GET"])
def list_customers():
    user_id, error = _require_user_id()
    if error:
        return error

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    try:
        limit = int(request.args.get("limit", 12))
    except (TypeError, ValueError):
        limit = 12
    try:
        offset = int(request.args.get("offset", 0))
    except (TypeError, ValueError):
        offset = 0

    limit = max(1, min(limit, 50))
    offset = max(0, offset)

    customers = customer_execute(ListCustomersQuery(
        schema_name=tenant.schema_name,
        limit=limit,
        offset=offset,
    ))
    return jsonify([
        {
            "id": str(c.id),
            "tax_id": str(c.tax_id),
            "legal_name": str(c.legal_name),
            "tax_regime": str(c.tax_regime),
            "zip": str(c.zip),
            "cfdi_use": str(c.cfdi_use),
            "email": c.email,
            "is_active": c.is_active,
            "avatar_url": c.avatar_url,
        }
        for c in customers
    ]), 200
