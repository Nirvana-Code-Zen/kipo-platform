from flask import jsonify, g

from . import emisor_bp
from shared.auth_decorators import require_auth
from shared.supabase import get_client
from emisor.execute import execute as emisor_execute
from emisor.commands import GetEmisorQuery
from shared.providers import get_tenant_repo


@emisor_bp.route("", methods=["GET"])
@require_auth
def get_emisor():
    user_id = g.user_id

    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    emisor = emisor_execute(GetEmisorQuery(schema_name=tenant.schema_name))
    if emisor is None:
        return "", 204

    return jsonify(_serialize(emisor)), 200


def _serialize(emisor) -> dict:
    return {
        "id": emisor.id,
        "rfc": emisor.rfc,
        "razon_social": emisor.razon_social,
        "regimen_fiscal": emisor.regimen_fiscal,
        "codigo_postal": emisor.codigo_postal,
        "series": emisor.series,
        "folio_siguiente": emisor.folio_siguiente,
        "created_at": emisor.created_at,
        "updated_at": emisor.updated_at,
        "csd_configured": emisor.csd_configured,
        "csd_configured_at": emisor.csd_configured_at,
        "manifiesto_signed": emisor.manifiesto_signed,
        "manifiesto_signed_at": emisor.manifiesto_signed_at,
        "custom_section_html": emisor.custom_section_html,
        "display_options": emisor.display_options,
        "logo_url": get_client().storage.from_("org-logos").get_public_url(emisor.logo_path) if emisor.logo_path else None,
    }
