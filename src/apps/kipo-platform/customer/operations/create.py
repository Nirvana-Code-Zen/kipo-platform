from uuid import uuid4
from customer.repository import ICustomerRepository
from customer.customer import Customer
from customer.value_objects.customer_id import CustomerId
from customer.value_objects.tax_id import TaxId
from customer.value_objects.legal_name import LegalName
from customer.value_objects.tax_regime import TaxRegime
from customer.value_objects.zip_code import ZipCode


def execute(
    repo: ICustomerRepository,
    schema_name: str,
    raw_tax_id: str,
    raw_legal_name: str,
    raw_tax_regime: str,
    raw_zip: str,
    email: str,
    avatar_url: str | None,
) -> Customer:
    customer = Customer(
        id=CustomerId(str(uuid4())),
        tax_id=TaxId(raw_tax_id),
        legal_name=LegalName(raw_legal_name),
        tax_regime=TaxRegime(raw_tax_regime),
        zip=ZipCode(raw_zip),
        email=email,
        is_active=True,
        avatar_url=avatar_url,
    )
    return repo.save(customer, schema_name)
