import re
from shared.exceptions import BusinessRuleViolation

_PATTERN = re.compile(r"^\+[1-9]\d{7,14}$")


class PhoneNumber(str):
    def __new__(cls, value: str) -> "PhoneNumber":
        normalized = value.strip() if value else ""
        if not _PATTERN.match(normalized):
            raise BusinessRuleViolation(
                f"'{value}' is not a valid phone number. Must be E.164 format (e.g. +521234567890)."
            )
        return super().__new__(cls, normalized)
