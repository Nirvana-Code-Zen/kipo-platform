import mimetypes
from flask import jsonify, g, request

from . import emisor_bp
from .get import _serialize
from shared.auth_decorators import require_auth
from shared.supabase import get_client
from shared.providers import get_tenant_repo
from emisor.execute import execute as emisor_execute
from emisor.commands import UpdateLogoCommand
from shared.exceptions import NotFound, BusinessRuleViolation

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


@emisor_bp.route("/logo", methods=["POST"])
@require_auth
def upload_logo():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "file required"}), 400

    content_type = file.content_type or ""
    if content_type not in ALLOWED_CONTENT_TYPES:
        return jsonify({"error": "Formato no soportado. Usa PNG, JPG o WEBP."}), 400

    user_id = g.user_id
    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    filename = file.filename or "logo"
    ext = filename.rsplit(".", 1)[-1] if "." in filename else (mimetypes.guess_extension(content_type) or ".png").lstrip(".")
    path = f"{tenant.schema_name}/logo.{ext}"

    try:
        file_bytes = file.read()
        get_client().storage.from_("org-logos").upload(
            path,
            file_bytes,
            file_options={"content-type": content_type, "upsert": "true"},
        )
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

    try:
        emisor = emisor_execute(UpdateLogoCommand(schema_name=tenant.schema_name, logo_path=path))
    except NotFound as exc:
        return jsonify({"error": str(exc)}), 404
    except BusinessRuleViolation as exc:
        return jsonify({"error": str(exc)}), 400

    return jsonify(_serialize(emisor)), 200
