from flask import Blueprint, request, jsonify
from catalog.execute import execute as catalog_execute
from catalog.commands import (
    ListCartaPorteCatalogQuery,
    ListComercioExteriorCatalogQuery,
    ListCfdiCatalogQuery,
)
from shared.auth_decorators import require_auth
from shared.exceptions import BusinessRuleViolation

catalogs_bp = Blueprint("catalogs", __name__, url_prefix="/api/v1/catalogs")


@catalogs_bp.route("/carta-porte", methods=["GET"])
@require_auth
def carta_porte_catalog():
    try:
        items = catalog_execute(ListCartaPorteCatalogQuery(
            catalog_type=request.args.get("type", ""),
        ))
        return jsonify(items), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@catalogs_bp.route("/comercio-exterior", methods=["GET"])
@require_auth
def comercio_exterior_catalog():
    try:
        items = catalog_execute(ListComercioExteriorCatalogQuery(
            catalog_type=request.args.get("type", ""),
        ))
        return jsonify(items), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400


@catalogs_bp.route("/cfdi", methods=["GET"])
@require_auth
def cfdi_catalog():
    try:
        items = catalog_execute(ListCfdiCatalogQuery(
            catalog_type=request.args.get("type", ""),
        ))
        return jsonify(items), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400
