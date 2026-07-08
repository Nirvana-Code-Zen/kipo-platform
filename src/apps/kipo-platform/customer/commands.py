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


@dataclass(frozen=True)
class UpdateCustomerCommand:
    schema_name: str
    customer_id: str
    tax_id: str
    legal_name: str
    tax_regime: str
    zip: str
    cfdi_use: str
    email: str
    avatar_url: str | None = None


@dataclass(frozen=True)
class DeactivateCustomerCommand:
    schema_name: str
    customer_id: str


@dataclass(frozen=True)
class ActivateCustomerCommand:
    schema_name: str
    customer_id: str


@dataclass(frozen=True)
class DeleteCustomerCommand:
    schema_name: str
    customer_id: str


@dataclass(frozen=True)
class ListCustomersQuery:
    schema_name: str
    limit: int = 12
    offset: int = 0
