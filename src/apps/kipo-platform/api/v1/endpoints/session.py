from dataclasses import asdict
from flask import Blueprint, request, jsonify
from auth.execute import execute as auth_execute
from auth.commands import (
    SignUpWithEmailCommand,
    SignInWithEmailCommand,
    SignInWithPhoneCommand,
    VerifyPhoneOtpCommand,
    SignInWithOAuthCommand,
    SignOutCommand,
)
from shared.exceptions import BusinessRuleViolation

session_bp = Blueprint("session", __name__, url_prefix="/api/v1/auth")


@session_bp.route("/sign-up", methods=["POST"])
def register():
    data = request.get_json() or {}
    try:
        identity = auth_execute(SignUpWithEmailCommand(
            email=data.get("email", ""),
            password=data.get("password", ""),
        ))
        return jsonify(asdict(identity)), 201
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-in/email", methods=["POST"])
def login_email():
    data = request.get_json() or {}
    try:
        session = auth_execute(SignInWithEmailCommand(
            email=data.get("email", ""),
            password=data.get("password", ""),
        ))
        return jsonify(session), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


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
        session = auth_execute(VerifyPhoneOtpCommand(
            phone=data.get("phone", ""),
            token=data.get("token", ""),
        ))
        return jsonify(session), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-in/oauth", methods=["POST"])
def login_oauth():
    data = request.get_json() or {}
    try:
        url = auth_execute(SignInWithOAuthCommand(
            provider=data.get("provider", ""),
            redirect_to=data.get("redirect_to", ""),
        ))
        return jsonify({"url": url}), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@session_bp.route("/sign-out", methods=["POST"])
def logout():
    token = request.headers.get("Authorization", "").removeprefix("Bearer ").strip()
    auth_execute(SignOutCommand(access_token=token))
    return jsonify({"message": "Signed out"}), 200
