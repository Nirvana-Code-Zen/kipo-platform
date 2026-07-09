from flask import jsonify, request, g

from . import emisor_bp
from api.v1.endpoints.emisor.get import _serialize
from shared.auth_decorators import require_auth
from emisor.execute import execute as emisor_execute
from emisor.commands import UpsertEmisorCommand
from shared.providers import get_tenant_repo


@emisor_bp.route("", methods=["PUT"])
@require_auth
def upsert_emisor():
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    data = request.get_json() or {}
    emisor = emisor_execute(
        UpsertEmisorCommand(
            schema_name=tenant.schema_name,
            rfc=data.get("rfc", ""),
            razon_social=data.get("razon_social", ""),
            regimen_fiscal=data.get("regimen_fiscal", ""),
            codigo_postal=data.get("codigo_postal", ""),
            series=data.get("series"),
        )
    )
    return jsonify(_serialize(emisor)), 200
