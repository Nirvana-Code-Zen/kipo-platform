import os
import time
import mimetypes
import requests as http
from flask import Blueprint, jsonify, request, g

from shared.auth_decorators import require_auth
from shared.supabase import get_client
from shared.providers import get_tenant_repo

profile_bp = Blueprint("profile", __name__, url_prefix="/api/v1/profile")

_GOTRUE_URL = os.environ.get("PROJECT_URL", "http://127.0.0.1:54321") + "/auth/v1"


def _gotrue_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


@profile_bp.route("", methods=["PUT"])
@require_auth
def update_profile():
    data = request.get_json() or {}
    token = g.access_token

    patch: dict = {}
    if "display_name" in data:
        patch["display_name"] = data["display_name"]
    if "avatar_url" in data:
        patch["avatar_url"] = data["avatar_url"]

    resp = http.put(
        f"{_GOTRUE_URL}/user",
        json={"data": patch},
        headers=_gotrue_headers(token),
        timeout=10,
    )
    resp.raise_for_status()
    updated_metadata = resp.json().get("user_metadata") or {}

    return jsonify({
        "display_name": updated_metadata.get("display_name"),
        "avatar_url": updated_metadata.get("avatar_url"),
    }), 200


@profile_bp.route("/email", methods=["PUT"])
@require_auth
def update_email():
    data = request.get_json() or {}
    token = g.access_token

    resp = http.put(
        f"{_GOTRUE_URL}/user",
        json={"email": data.get("email", "")},
        headers=_gotrue_headers(token),
        timeout=10,
    )
    resp.raise_for_status()

    return jsonify({"ok": True}), 200


@profile_bp.route("/avatar", methods=["POST"])
@require_auth
def upload_avatar():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "file required"}), 400

    user_id = g.user_id
    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not tenant:
        return jsonify({"error": "tenant not found — complete onboarding first"}), 400

    filename = file.filename or "avatar"
    content_type = file.content_type or "image/jpeg"
    ext = filename.rsplit(".", 1)[-1] if "." in filename else (mimetypes.guess_extension(content_type) or ".jpg").lstrip(".")
    path = f"{tenant.schema_name}/{user_id}/{int(time.time() * 1000)}.{ext}"

    try:
        file_bytes = file.read()
        get_client().storage.from_("profiles").upload(
            path,
            file_bytes,
            file_options={"content-type": content_type, "upsert": "true"},
        )
        result = get_client().storage.from_("profiles").create_signed_url(path, 31_536_000)
        signed_url = getattr(result, "signed_url", None) or (result.get("signedURL", "") if isinstance(result, dict) else "")
        return jsonify({"url": signed_url, "path": path}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@profile_bp.route("/avatar-url", methods=["POST"])
@require_auth
def get_avatar_signed_url():
    data = request.get_json() or {}
    path = data.get("path", "").strip("/")
    if not path:
        return jsonify({"error": "path required"}), 400
    try:
        result = get_client().storage.from_("profiles").create_signed_url(path, 31_536_000)
        signed_url = getattr(result, "signed_url", None) or (result.get("signedURL", "") if isinstance(result, dict) else "")
        return jsonify({"url": signed_url}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
