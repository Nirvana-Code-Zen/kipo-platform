import re
from shared.exceptions import BusinessRuleViolation

_RFC_RE = re.compile(r"^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$")


class TaxId(str):
    def __new__(cls, value: str) -> "TaxId":
        v = (value or "").strip().upper()
        if not _RFC_RE.match(v):
            raise BusinessRuleViolation(
                "TaxId must be a valid RFC (e.g. XAXX010101000 or XAXX010101AAA)."
            )
        return super().__new__(cls, v)
