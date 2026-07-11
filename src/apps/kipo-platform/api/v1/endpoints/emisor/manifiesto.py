from flask import jsonify, g

from . import emisor_bp
from api.v1.endpoints.emisor.get import _serialize
from shared.auth_decorators import require_auth
from shared.exceptions import NotFound
from emisor.execute import execute as emisor_execute
from emisor.commands import ConfirmManifiestoCommand
from shared.providers import get_tenant_repo


@emisor_bp.route("/manifiesto/confirm", methods=["POST"])
@require_auth
def confirm_manifiesto():
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    try:
        emisor = emisor_execute(ConfirmManifiestoCommand(schema_name=tenant.schema_name))
    except NotFound as exc:
        return jsonify({"error": str(exc)}), 404

    return jsonify(_serialize(emisor)), 200
