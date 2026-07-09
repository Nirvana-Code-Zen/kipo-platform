from dataclasses import dataclass


@dataclass(frozen=True)
class CreateInvoiceCommand:
    schema_name: str
    voucher_type: str
    payment_method: str
    payment_form: str
    currency: str
    export_type: str
    issuer_zip: str
    customer_id: str | None
    receiver: dict
    concepts: list[dict]


@dataclass(frozen=True)
class ListInvoicesQuery:
    schema_name: str
    limit: int = 20
    offset: int = 0


@dataclass(frozen=True)
class CancelInvoiceCommand:
    schema_name: str
    invoice_id: str


@dataclass(frozen=True)
class DeleteInvoiceCommand:
    schema_name: str
    invoice_id: str


@dataclass(frozen=True)
class GetInvoiceStatsQuery:
    schema_name: str


@dataclass(frozen=True)
class GetInvoiceDashboardStatsQuery:
    schema_name: str


@dataclass(frozen=True)
class GetBillingActivityQuery:
    schema_name: str
    view: str
    week_start: str | None = None
