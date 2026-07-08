from flask import Blueprint

invoices_bp = Blueprint("invoices", __name__, url_prefix="/api/v1/invoices")

from . import cancel  # noqa: E402
from . import create  # noqa: E402
from . import delete  # noqa: E402
from . import stats   # noqa: E402
from . import list as list_invoices  # noqa: E402
