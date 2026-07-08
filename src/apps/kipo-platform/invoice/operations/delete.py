from invoice.repository import IInvoiceRepository


def execute(repo: IInvoiceRepository, schema_name: str, invoice_id: str) -> None:
    repo.delete(invoice_id, schema_name)
