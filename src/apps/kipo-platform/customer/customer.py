from dataclasses import dataclass
from customer.value_objects.customer_id import CustomerId
from customer.value_objects.tax_id import TaxId
from customer.value_objects.legal_name import LegalName
from customer.value_objects.tax_regime import TaxRegime
from customer.value_objects.zip_code import ZipCode


@dataclass(frozen=True)
class Customer:
    id: CustomerId
    tax_id: TaxId
    legal_name: LegalName
    tax_regime: TaxRegime
    zip: ZipCode
    email: str
    is_active: bool
    avatar_url: str | None
