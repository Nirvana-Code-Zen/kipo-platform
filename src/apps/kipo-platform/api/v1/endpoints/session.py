from flask import Blueprint, request, jsonify
from auth.operations import sign_in, sign_up, sign_out, verify_otp
from shared.exceptions import BusinessRuleViolation
from dataclasses import asdict

session_bp = Blueprint("session", __name__, url_prefix="/api/v1/auth")


@session_bp.route("/sign-up", methods=["POST"])
def register():
    data = request.get_json() or {}
    try:
        identity = sign_up.with_email(data.get("email"), data.get("password"))
        return jsonify(asdict(identity)), 201
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-in/email", methods=["POST"])
def login_email():
    data = request.get_json() or {}
    try:
        session = sign_in.with_email(data.get("email"), data.get("password"))
        return jsonify(session), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-in/phone", methods=["POST"])
def login_phone():
    data = request.get_json() or {}
    try:
        sign_in.with_phone_otp(data.get("phone"))
        return jsonify({"message": "OTP sent"}), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-in/phone/verify", methods=["POST"])
def verify_phone():
    data = request.get_json() or {}
    try:
        session = verify_otp.execute(data.get("phone"), data.get("token"))
        return jsonify(session), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-in/oauth", methods=["POST"])
def login_oauth():
    data = request.get_json() or {}
    try:
        url = sign_in.with_oauth(
            data.get("provider"),
            data.get("redirect_to", ""),
        )
        return jsonify({"url": url}), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-out", methods=["POST"])
def logout():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.removeprefix("Bearer ").strip()
    sign_out.execute(token)
    return jsonify({"message": "Signed out"}), 200
