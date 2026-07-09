from flask import Blueprint

emisor_bp = Blueprint("emisor", __name__, url_prefix="/api/v1/emisor")

from . import get    # noqa: E402
from . import upsert  # noqa: E402
