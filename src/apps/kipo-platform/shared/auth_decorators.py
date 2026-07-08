from functools import wraps
from flask import request, jsonify, g
from shared.supabase import get_client


def require_auth(f):
    @wraps(f)
    def decorated_functions(*args, **kwargs):
        token = request.headers.get("Authorization", "").removeprefix("Bearer ").strip()

        if not token:
            return jsonify({"error": "Unauthorized"}), 401
        try:
            user = get_client().auth.get_user(token)
            g.user_id = str(user.user.id)
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(*args, **kwargs)

    return decorated_functions

