from datetime import datetime, timedelta, timezone
from invoice.repository import IInvoiceRepository
from invoice.invoice import Invoice


def execute(
    repo: IInvoiceRepository,
    schema_name: str,
    limit: int,
    offset: int,
    history_months: int | None = None,
) -> list[Invoice]:
    since = None
    if history_months is not None:
        since = datetime.now(timezone.utc) - timedelta(days=history_months * 30)
    return repo.find_all(schema_name, limit, offset, since)
