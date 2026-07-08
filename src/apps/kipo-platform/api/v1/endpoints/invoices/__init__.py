from api.v1.endpoints.invoices.delete import delete_invoice
from flask import Blueprint

invoices_bp = Blueprint("invoices", __name__, url_prefix="/api/v1/invoices")

from . import (
    cancel_invoice,
    create_invoice,
    delete_invoice,
    list_invoices,
    invoice_stats,
)
