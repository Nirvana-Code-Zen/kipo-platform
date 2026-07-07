import re
from shared.exceptions import BusinessRuleViolation

_INVALID_CHARS = re.compile(r"[^a-z0-9\-]")


class TenantName(str):
    def __new__(cls, value: str) -> "TenantName":
        if not value or not value.strip():
            raise BusinessRuleViolation("Tenant name cannot be empty.")

        normalized = "-".join(value.strip().lower().split())

        if _INVALID_CHARS.search(normalized):
            raise BusinessRuleViolation(
                f"Tenant name '{value}' contains invalid characters. "
                "Only letters, numbers, and hyphens are allowed."
            )
        if len(normalized) < 3:
            raise BusinessRuleViolation("Tenant name must be at least 3 characters.")

        return super().__new__(cls, normalized)

    @property
    def schema(self) -> str:
        return f"tenant_{self}"
