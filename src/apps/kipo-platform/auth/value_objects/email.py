import re
from shared.exceptions import BusinessRuleViolation

_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class Email(str):
    def __new__(cls, value: str) -> "Email":
        normalized = value.strip().lower() if value else ""
        if not _PATTERN.match(normalized):
            raise BusinessRuleViolation(f"'{value}' is not a valid email address.")
        return super().__new__(cls, normalized)
