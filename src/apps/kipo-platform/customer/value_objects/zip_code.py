import re
from shared.exceptions import BusinessRuleViolation

_ZIP_RE = re.compile(r"^\d{5}$")


class ZipCode(str):
    def __new__(cls, value: str) -> "ZipCode":
        v = (value or "").strip()
        if not _ZIP_RE.match(v):
            raise BusinessRuleViolation("ZipCode must be exactly 5 digits.")
        return super().__new__(cls, v)
