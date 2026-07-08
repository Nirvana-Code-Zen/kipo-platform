from dataclasses import dataclass


@dataclass(frozen=True)
class CreateCustomerCommand:
    schema_name: str
    tax_id: str
    legal_name: str
    tax_regime: str
    zip: str
    cfdi_use: str
    email: str
    avatar_url: str | None = None
