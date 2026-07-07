from api.v1 import v1_bp
from api.v1.endpoints.session import session_bp


def register_blueprints(app):
    app.register_blueprint(v1_bp)
    app.register_blueprint(session_bp)
