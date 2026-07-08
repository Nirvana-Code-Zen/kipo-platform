from shared.exceptions import BusinessRuleViolation


class CustomerId(str):
    def __new__(cls, value: str) -> "CustomerId":
        if not value or not value.strip():
            raise BusinessRuleViolation("CustomerId cannot be empty.")
        return super().__new__(cls, value.strip())
