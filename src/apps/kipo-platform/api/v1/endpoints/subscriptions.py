from flask import Blueprint, request, jsonify, g, current_app

from subscriptions.execute import execute as subscriptions_execute
from subscriptions.commands import CreateCheckoutSessionCommand, SyncFromStripeWebhookCommand
from tenant.execute import execute as tenant_execute
from tenant.commands import UpdateTenantPlanCommand
from shared.auth_decorators import require_auth
from shared.supabase import get_client
from shared.providers import get_tenant_repo
from shared.exceptions import BusinessRuleViolation

subscriptions_bp = Blueprint("subscriptions", __name__, url_prefix="/api/v1/subscriptions")


@subscriptions_bp.route("/checkout", methods=["POST"])
@require_auth
def create_checkout():
    tenant = get_tenant_repo().find_by_auth_id(g.user_id)
    if not tenant:
        return jsonify({"error": "Tenant not found for this user"}), 404

    data = request.get_json() or {}
    tier = data.get("tier", "")
    success_url = data.get("success_url", "")
    cancel_url = data.get("cancel_url", "")
    if not success_url or not cancel_url:
        return jsonify({"error": "success_url and cancel_url are required"}), 400

    user = get_client().auth.get_user(g.access_token)

    try:
        checkout_url = subscriptions_execute(
            CreateCheckoutSessionCommand(
                tenant_id=str(tenant.id),
                tenant_email=user.user.email or "",
                tier=tier,
                success_url=success_url,
                cancel_url=cancel_url,
            )
        )
        return jsonify({"checkout_url": checkout_url}), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@subscriptions_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.get_data()
    signature = request.headers.get("Stripe-Signature", "")
    webhook_secret = current_app.config["STRIPE_WEBHOOK_SECRET"]

    try:
        sync = subscriptions_execute(
            SyncFromStripeWebhookCommand(
                payload=payload, signature=signature, webhook_secret=webhook_secret
            )
        )
    except Exception:
        return jsonify({"error": "Invalid webhook payload"}), 400

    if sync is not None:
        tenant_execute(
            UpdateTenantPlanCommand(
                tenant_id=sync.tenant_id,
                plan_type=sync.plan_type,
                status=sync.status,
                features_enabled=sync.features_enabled,
            )
        )

    return jsonify({"received": True}), 200
