from flask import Blueprint

v1_bp = Blueprint("v1", __name__, url_prefix="/api/v1")

from api.v1.endpoints import health
from api.v1.endpoints.session import session_bp
