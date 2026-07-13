from flask import jsonify, request, g

from . import emisor_bp
from api.v1.endpoints.emisor.get import _serialize
from shared.auth_decorators import require_auth
from shared.exceptions import BusinessRuleViolation, NotFound
from emisor.execute import execute as emisor_execute
from emisor.commands import UpdatePdfCustomizationCommand
from shared.providers import get_tenant_repo


@emisor_bp.route("/pdf-customization", methods=["PUT"])
@require_auth
def update_pdf_customization():
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    body = request.get_json(silent=True) or {}

    custom_section_html = body.get("custom_section_html")
    if custom_section_html is not None and not isinstance(custom_section_html, str):
        return jsonify({"error": "custom_section_html must be a string or null"}), 400

    display_options = body.get("display_options")
    if not isinstance(display_options, dict):
        return jsonify({"error": "display_options must be an object"}), 400

    try:
        emisor = emisor_execute(
            UpdatePdfCustomizationCommand(
                schema_name=tenant.schema_name,
                custom_section_html=custom_section_html,
                display_options=display_options,
            )
        )
    except NotFound as exc:
        return jsonify({"error": str(exc)}), 404
    except BusinessRuleViolation as exc:
        return jsonify({"error": str(exc)}), 400

    return jsonify(_serialize(emisor)), 200
