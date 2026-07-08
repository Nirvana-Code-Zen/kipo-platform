from customer.repository import ICustomerRepository
from customer.customer import Customer
from customer.value_objects.tax_id import TaxId
from customer.value_objects.legal_name import LegalName
from customer.value_objects.tax_regime import TaxRegime
from customer.value_objects.zip_code import ZipCode
from customer.value_objects.cfdi_use import CfdiUse


def execute(
    repo: ICustomerRepository,
    schema_name: str,
    customer_id: str,
    raw_tax_id: str,
    raw_legal_name: str,
    raw_tax_regime: str,
    raw_zip: str,
    raw_cfdi_use: str,
    email: str,
    avatar_url: str | None,
) -> Customer:
    fields = {
        "tax_id": str(TaxId(raw_tax_id)),
        "legal_name": str(LegalName(raw_legal_name)),
        "tax_regime": str(TaxRegime(raw_tax_regime)),
        "zip": str(ZipCode(raw_zip)),
        "cfdi_use": str(CfdiUse(raw_cfdi_use)),
        "email": email,
        "avatar_url": avatar_url,
    }
    return repo.update(customer_id, fields, schema_name)
