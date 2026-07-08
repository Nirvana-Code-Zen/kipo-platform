from typing import Any
from invoice.commands import (
    CreateInvoiceCommand,
    ListInvoicesQuery,
    CancelInvoiceCommand,
    DeleteInvoiceCommand,
    GetInvoiceStatsQuery,
    GetInvoiceDashboardStatsQuery,
    GetBillingActivityQuery,
)
from invoice.operations import create
from invoice.operations import list as list_
from invoice.operations import cancel as cancel_
from invoice.operations import delete as delete_
from invoice.operations import dashboard_stats
from invoice.operations import billing_activity as billing_activity_
from shared.providers import get_invoice_repo
from shared.exceptions import BusinessRuleViolation


def execute(command: Any) -> Any:
    repo = get_invoice_repo()
    match command:
        case CreateInvoiceCommand(
            schema_name,
            voucher_type,
            series,
            payment_method,
            payment_form,
            currency,
            export_type,
            issuer_zip,
            customer_id,
            receiver,
            concepts,
        ):
            return create.execute(
                repo,
                schema_name,
                voucher_type,
                series,
                payment_method,
                payment_form,
                currency,
                export_type,
                issuer_zip,
                customer_id,
                receiver,
                concepts,
            )
        case ListInvoicesQuery(schema_name, limit, offset):
            return list_.execute(repo, schema_name, limit, offset)
        case CancelInvoiceCommand(schema_name, invoice_id):
            return cancel_.execute(repo, schema_name, invoice_id)
        case DeleteInvoiceCommand(schema_name, invoice_id):
            return delete_.execute(repo, schema_name, invoice_id)
        case GetInvoiceStatsQuery(schema_name):
            return {
                "stamped": repo.count_by_status(schema_name, "stamped"),
                "draft": repo.count_by_status(schema_name, "draft"),
            }
        case GetInvoiceDashboardStatsQuery(schema_name):
            return dashboard_stats.execute(repo, schema_name)
        case GetBillingActivityQuery(schema_name, view, week_start):
            return billing_activity_.execute(repo, schema_name, view, week_start)
        case _:
            raise BusinessRuleViolation(f"Unknown invoice command: {type(command).__name__}")
