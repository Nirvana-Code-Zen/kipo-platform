import os
import requests as http
from flask import Blueprint, jsonify, request, g

from shared.auth_decorators import require_auth

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
