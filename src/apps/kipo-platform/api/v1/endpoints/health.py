from flask import jsonify
from api.v1 import v1_bp


@v1_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200
