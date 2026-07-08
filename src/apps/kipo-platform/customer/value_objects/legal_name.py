from shared.exceptions import BusinessRuleViolation


class LegalName(str):
    def __new__(cls, value: str) -> "LegalName":
        v = (value or "").strip()
        if not v:
            raise BusinessRuleViolation("LegalName cannot be empty.")
        return super().__new__(cls, v)
