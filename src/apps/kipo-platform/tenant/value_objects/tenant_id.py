from shared.exceptions import BusinessRuleViolation


class TenantId(str):
    def __new__(cls, value: str) -> "TenantId":
        if not value or not value.strip():
            raise BusinessRuleViolation("TenantId cannot be empty.")
        return super().__new__(cls, value.strip())
