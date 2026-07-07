from shared.exceptions import BusinessRuleViolation


class UserId(str):
    def __new__(cls, value: str) -> "UserId":
        if not value or not value.strip():
            raise BusinessRuleViolation("UserId cannot be empty.")
        return super().__new__(cls, value.strip())
