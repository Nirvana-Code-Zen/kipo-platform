from flask import jsonify, request, g

from . import emisor_bp
from api.v1.endpoints.emisor.get import _serialize
from shared.auth_decorators import require_auth
from shared.exceptions import BusinessRuleViolation, NotFound
from emisor.execute import execute as emisor_execute
from emisor.commands import UploadCsdCommand
from shared.providers import get_tenant_repo


@emisor_bp.route("/csd", methods=["POST"])
@require_auth
def upload_csd():
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    cer_file = request.files.get("cer_file")
    key_file = request.files.get("key_file")
    password = request.form.get("password", "")

    if not cer_file or not cer_file.filename or not cer_file.filename.lower().endswith(".cer"):
        return jsonify({"error": "Se requiere un archivo .cer válido"}), 400
    if not key_file or not key_file.filename or not key_file.filename.lower().endswith(".key"):
        return jsonify({"error": "Se requiere un archivo .key válido"}), 400
    if not password:
        return jsonify({"error": "La contraseña de la llave privada es requerida"}), 400

    try:
        emisor = emisor_execute(
            UploadCsdCommand(
                schema_name=tenant.schema_name,
                cer_bytes=cer_file.read(),
                key_bytes=key_file.read(),
                password=password,
            )
        )
    except NotFound as exc:
        return jsonify({"error": str(exc)}), 404
    except BusinessRuleViolation as exc:
        return jsonify({"error": str(exc)}), 400

    return jsonify(_serialize(emisor)), 200
