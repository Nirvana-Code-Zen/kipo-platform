from shared.exceptions import BusinessRuleViolation


class CfdiUse(str):
    def __new__(cls, value: str) -> "CfdiUse":
        v = (value or "").strip().upper()
        if not v:
            raise BusinessRuleViolation("CfdiUse cannot be empty.")
        return super().__new__(cls, v)
