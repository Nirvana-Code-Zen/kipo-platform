from invoice.repository import IInvoiceRepository
from invoice.invoice import Invoice


def execute(
    repo: IInvoiceRepository,
    schema_name: str,
    limit: int,
    offset: int,
) -> list[Invoice]:
    return repo.find_all(schema_name, limit, offset)
