from api.v1 import v1_bp
from api.v1.endpoints.session import session_bp
from api.v1.endpoints.tenants import tenants_bp
from api.v1.endpoints.customers import customers_bp
from api.v1.endpoints.invoices import invoices_bp
from api.v1.endpoints.dashboard import dashboard_bp
from api.v1.endpoints.emisor import emisor_bp
from api.v1.endpoints.profile import profile_bp
from api.v1.endpoints.catalogs import catalogs_bp
from api.v1.endpoints.subscriptions import subscriptions_bp
from api.v1.endpoints.stamp_packs import stamp_packs_bp


def register_blueprints(app):
    app.register_blueprint(v1_bp)
    app.register_blueprint(session_bp)
    app.register_blueprint(tenants_bp)
    app.register_blueprint(customers_bp)
    app.register_blueprint(invoices_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(emisor_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(catalogs_bp)
    app.register_blueprint(subscriptions_bp)
    app.register_blueprint(stamp_packs_bp)
