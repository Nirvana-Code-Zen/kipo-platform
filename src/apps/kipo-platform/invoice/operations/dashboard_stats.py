from invoice.repository import IInvoiceRepository


def execute(repo: IInvoiceRepository, schema_name: str) -> dict:
    return repo.get_dashboard_stats(schema_name)
