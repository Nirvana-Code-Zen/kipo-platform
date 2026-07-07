from dataclasses import dataclass


@dataclass(frozen=True)
class Identity:
    id: str
    email: str | None
    phone: str | None
    provider: str  # email | phone | google | facebook
