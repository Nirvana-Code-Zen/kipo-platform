import os
from functools import wraps

import jwt
from flask import request, jsonify, g
from jwt import PyJWKClient

_PROJECT_URL = os.environ.get("PROJECT_URL", "http://127.0.0.1:54321")
_JWKS_URL = f"{_PROJECT_URL}/auth/v1/.well-known/jwks.json"

_jwk_client: PyJWKClient | None = None


def _get_jwk_client() -> PyJWKClient:
    global _jwk_client
    if _jwk_client is None:
        _jwk_client = PyJWKClient(_JWKS_URL, cache_keys=True)
    return _jwk_client


def require_auth(f):
    @wraps(f)
    def decorated_functions(*args, **kwargs):
        token = request.headers.get("Authorization", "").removeprefix("Bearer ").strip()

        if not token:
            return jsonify({"error": "Unauthorized"}), 401
        try:
            signing_key = _get_jwk_client().get_signing_key_from_jwt(token)
            claims = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256"],
                audience="authenticated",
            )
            g.user_id = claims["sub"]
            g.access_token = token
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(*args, **kwargs)

    return decorated_functions
