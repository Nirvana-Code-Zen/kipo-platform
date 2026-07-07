from shared.exceptions import BusinessRuleViolation

_MIN_LENGTH = 8


class Password(str):
    def __new__(cls, value: str) -> "Password":
        if not value or len(value) < _MIN_LENGTH:
            raise BusinessRuleViolation(
                f"Password must be at least {_MIN_LENGTH} characters long."
            )
        return super().__new__(cls, value)
