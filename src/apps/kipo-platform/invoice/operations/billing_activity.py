from invoice.repository import IInvoiceRepository


def execute(repo: IInvoiceRepository, schema_name: str, view: str, week_start: str | None) -> list[dict]:
    return repo.get_billing_activity(schema_name, view, week_start)
