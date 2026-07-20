import os
from flask import Blueprint, request, jsonify, make_response, g
from shared.config import config_mapping
from auth.execute import execute as auth_execute
from auth.commands import (
    SignUpWithEmailCommand,
    SignInWithEmailCommand,
    SignInWithPhoneCommand,
    VerifyPhoneOtpCommand,
    SignInWithOAuthCommand,
    SignOutCommand,
    RefreshSessionCommand,
    OAuthCallbackCommand,
    CreateExchangeCodeCommand,
    ConsumeExchangeCodeCommand,
)
from shared.exceptions import BusinessRuleViolation
from shared.providers import get_tenant_repo
from shared.auth_decorators import require_auth
from tenant.value_objects.tenant_slug import public_slug

session_bp = Blueprint("session", __name__, url_prefix="/api/v1/auth")

env_name = os.environ.get("FLASK_ENV", "development")
config_class = config_mapping[env_name]()


def _session_response(auth_result: dict, user_id: str, tenant) -> dict:
    user = auth_result["user"]
    display_name = user.display_name or str(user.email or user.phone or "")
    return {
        "user_id": user_id,
        "access_token": auth_result["access_token"],
        "expires_at": auth_result.get("expires_at", ""),
        "display_name": display_name,
        "email": str(user.email) if user.email else None,
        "phone": str(user.phone) if user.phone else None,
        "provider": str(user.provider),
        "tenant_id": str(tenant.id) if tenant else None,
        "tenant_slug": public_slug(tenant.schema_name) if tenant else None,
        "tenant_name": tenant.name if tenant else None,
        "avatar_url": user.avatar_url,
    }


def _slug_matches(tenant, expected_slug: str | None) -> bool:
    if not expected_slug:
        return True
    return tenant is not None and public_slug(tenant.schema_name) == expected_slug


def _resolve_session(result: dict, expected_slug: str | None):
    user_id = str(result["user"].id)
    tenant = get_tenant_repo().find_by_auth_id(user_id)
    if not _slug_matches(tenant, expected_slug):
        return None, (jsonify({"error": "wrong_tenant"}), 403)
    resp = make_response(jsonify(_session_response(result, user_id, tenant)), 200)
    return resp, None


def _with_refresh_cookie(response, refresh_token: str):
    thirdty_days = 60 * 60 * 24 * 30
    response.set_cookie(
        "kipo_refresh_token",
        refresh_token,
        httponly=True,
        secure=config_class.COOKIE_SECURE,
        samesite="Lax",
        max_age=thirdty_days,
        path="/api/v1/auth",
    )
    return response


@session_bp.route("/sign-up", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email", "") or ""
    try:
        identity = auth_execute(
            SignUpWithEmailCommand(
                email=email,
                password=data.get("password", ""),
            )
        )
        return jsonify(
            {
                "email_pending": True,
                "email": str(identity.email) if identity.email else None,
            }
        ), 201
    except BusinessRuleViolation as err:
        msg = str(err).lower()
        if (
            "already registered" in msg
            or "already exists" in msg
            or "user already" in msg
        ):
            return jsonify({"email_pending": True, "email": email or None}), 201
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-in/email", methods=["POST"])
def login_email():
    data = request.get_json() or {}
    try:
        result = auth_execute(
            SignInWithEmailCommand(
                email=data.get("email", ""),
                password=data.get("password", ""),
            )
        )
        resp, error = _resolve_session(result, data.get("tenant_slug"))
        if error:
            return error
        return _with_refresh_cookie(resp, result["refresh_token"])
    except BusinessRuleViolation as err:
        msg = str(err).lower()
        status = (
            401
            if "invalid" in msg or "credentials" in msg or "not confirmed" in msg
            else 400
        )
        return jsonify({"error": str(err)}), status


@session_bp.route("/sign-in/phone", methods=["POST"])
def login_phone():
    data = request.get_json() or {}
    try:
        auth_execute(SignInWithPhoneCommand(phone=data.get("phone", "")))
        return jsonify({"message": "OTP sent"}), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-in/phone/verify", methods=["POST"])
def verify_phone():
    data = request.get_json() or {}
    try:
        result = auth_execute(
            VerifyPhoneOtpCommand(
                phone=data.get("phone", ""),
                token=data.get("token", ""),
            )
        )
        resp, error = _resolve_session(result, data.get("tenant_slug"))
        if error:
            return error
        return _with_refresh_cookie(resp, result["refresh_token"])
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-in/oauth", methods=["POST"])
def login_oauth():
    data = request.get_json() or {}
    try:
        url = auth_execute(
            SignInWithOAuthCommand(
                provider=data.get("provider", ""),
                redirect_to=data.get("redirect_to", ""),
            )
        )
        return jsonify({"url": url}), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/oauth/callback", methods=["POST"])
def oauth_callback():
    data = request.get_json() or {}
    try:
        result = auth_execute(
            OAuthCallbackCommand(
                access_token=data.get("access_token", ""),
                refresh_token=data.get("refresh_token", ""),
            )
        )
        resp, error = _resolve_session(result, data.get("tenant_slug"))
        if error:
            return error
        return _with_refresh_cookie(resp, result["refresh_token"])
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 401


@session_bp.route("/exchange-code", methods=["POST"])
@require_auth
def create_exchange_code():
    refresh_token = request.cookies.get("kipo_refresh_token")
    if not refresh_token:
        return jsonify({"error": "No refresh token"}), 401
    code = auth_execute(CreateExchangeCodeCommand(refresh_token=refresh_token, user_id=g.user_id))
    return jsonify({"code": code}), 200


@session_bp.route("/exchange-code/consume", methods=["POST"])
def consume_exchange_code():
    data = request.get_json() or {}
    code = data.get("code", "")
    if not code:
        return jsonify({"error": "Missing code"}), 400
    try:
        result = auth_execute(ConsumeExchangeCodeCommand(code=code))
        resp, error = _resolve_session(result, data.get("tenant_slug"))
        if error:
            return error
        return _with_refresh_cookie(resp, result["refresh_token"])
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 401


@session_bp.route("/sign-out", methods=["POST"])
def logout():
    token = request.headers.get("Authorization", "").removeprefix("Bearer ").strip()
    try:
        auth_execute(SignOutCommand(access_token=token))
    except Exception:
        pass
    resp = make_response(jsonify({"message": "Signed out"}), 200)
    resp.delete_cookie("kipo_refresh_token", path="/api/v1/auth")
    return resp


@session_bp.route("/refresh", methods=["POST"])
def refresh():
    refresh_token = request.cookies.get("kipo_refresh_token")
    if not refresh_token:
        return jsonify({"error": "No refresh token"}), 401
    try:
        result = auth_execute(RefreshSessionCommand(refresh_token=refresh_token))
        data = request.get_json(silent=True) or {}
        resp, error = _resolve_session(result, data.get("tenant_slug"))
        if error:
            return error
        return _with_refresh_cookie(resp, result["refresh_token"])
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 401
