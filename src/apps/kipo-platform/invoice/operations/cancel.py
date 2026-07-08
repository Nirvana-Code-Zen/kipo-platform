from invoice.repository import IInvoiceRepository


def execute(repo: IInvoiceRepository, schema_name: str, invoice_id: str) -> None:
    repo.cancel(invoice_id, schema_name)
