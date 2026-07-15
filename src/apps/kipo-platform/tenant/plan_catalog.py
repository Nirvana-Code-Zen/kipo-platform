import os
from dataclasses import dataclass

from tenant.tenant import Tenant
from tenant.value_objects.plan_type import PlanType

PLAN_CATALOG: dict[str, dict] = {
    "basico": {
        "plan_type": PlanType.FREE,
        "history_months": 6,
        "features": (),
        "stripe_price_id": None,
    },
    "emprendedor": {
        "plan_type": PlanType.PRO,
        "history_months": None,
        "features": (
            "csf_ocr",
            "efos_alert",
            "rfc_realtime_validation",
            "recurring_invoices",
            "whatsapp_reminders",
            "quotes_to_cfdi",
            "full_history_search",
        ),
        "stripe_price_id": os.environ.get("STRIPE_PRICE_EMPRENDEDOR"),
    },
    "pyme": {
        "plan_type": PlanType.PRO,
        "history_months": None,
        "features": (
            "csf_ocr",
            "efos_alert",
            "rfc_realtime_validation",
            "recurring_invoices",
            "whatsapp_reminders",
            "quotes_to_cfdi",
            "full_history_search",
            "multi_user",
            "rep_auto",
            "credit_note_relation",
            "guided_cancellations",
            "webhooks_api",
            "diot_report",
            "iva_dashboard",
        ),
        "stripe_price_id": os.environ.get("STRIPE_PRICE_PYME"),
    },
    "enterprise": {
        "plan_type": PlanType.ENTERPRISE,
        "history_months": None,
        "features": ("*",),
        "stripe_price_id": None,
    },
}


@dataclass(frozen=True)
class Entitlements:
    history_months: int | None
    features: tuple[str, ...]

    def has_feature(self, name: str) -> bool:
        return "*" in self.features or name in self.features


def tier_for_price_id(price_id: str) -> str | None:
    for tier, plan in PLAN_CATALOG.items():
        if plan["stripe_price_id"] == price_id:
            return tier
    return None


def entitlements_for(tenant: Tenant) -> Entitlements:
    if tenant.plan_type == PlanType.FREE:
        return Entitlements(history_months=6, features=tenant.features_enabled)
    if tenant.plan_type == PlanType.ENTERPRISE:
        return Entitlements(history_months=None, features=("*",))
    return Entitlements(history_months=None, features=tenant.features_enabled)
