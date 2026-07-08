from shared.exceptions import BusinessRuleViolation


class TaxRegime(str):
    def __new__(cls, value: str) -> "TaxRegime":
        v = (value or "").strip()
        if not v:
            raise BusinessRuleViolation("TaxRegime cannot be empty.")
        return super().__new__(cls, v)
