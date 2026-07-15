from flask import Blueprint, request, jsonify, g, current_app

from stamp_packs.execute import execute as stamp_packs_execute
from stamp_packs.commands import CreateStampCheckoutCommand, SyncStampPurchaseWebhookCommand
from shared.auth_decorators import require_auth
from shared.supabase import get_client
from shared.providers import get_tenant_repo
from shared.exceptions import BusinessRuleViolation

stamp_packs_bp = Blueprint("stamp_packs", __name__, url_prefix="/api/v1/stamp-packs")


@stamp_packs_bp.route("/checkout", methods=["POST"])
@require_auth
def create_checkout():
    tenant = get_tenant_repo().find_by_auth_id(g.user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    data = request.get_json() or {}
    pack_id = data.get("pack_id", "")
    success_url = data.get("success_url", "")
    cancel_url = data.get("cancel_url", "")
    if not success_url or not cancel_url:
        return jsonify({"error": "success_url and cancel_url are required"}), 400

    user = get_client().auth.get_user(g.access_token)

    try:
        checkout_url = stamp_packs_execute(
            CreateStampCheckoutCommand(
                tenant_id=str(tenant.id),
                tenant_email=user.user.email or "",
                pack_id=pack_id,
                success_url=success_url,
                cancel_url=cancel_url,
            )
        )
        return jsonify({"checkout_url": checkout_url}), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@stamp_packs_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.get_data()
    signature = request.headers.get("Stripe-Signature", "")
    webhook_secret = current_app.config["STRIPE_STAMP_WEBHOOK_SECRET"]

    try:
        stamp_packs_execute(
            SyncStampPurchaseWebhookCommand(
                payload=payload, signature=signature, webhook_secret=webhook_secret
            )
        )
    except Exception:
        return jsonify({"error": "Invalid webhook payload"}), 400

    return jsonify({"received": True}), 200
