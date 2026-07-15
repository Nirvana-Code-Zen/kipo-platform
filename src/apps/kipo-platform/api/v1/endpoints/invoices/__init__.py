from flask import Blueprint

invoices_bp = Blueprint("invoices", __name__, url_prefix="/api/v1/invoices")

from . import cancel
from . import create
from . import delete
from . import stats
from . import list as list_invoices
