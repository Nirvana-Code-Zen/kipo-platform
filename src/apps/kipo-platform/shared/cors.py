import os
import re
from flask import request, Response


_ORIGINS_BY_ENV: dict[str, list[str]] = {
    "development": [
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    "staging": [],      # add staging domains here
    "production": [],   # add prod domains here
}

_CORS_HEADERS = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
}


def _allowed_origins() -> list[str]:
    env = os.environ.get("FLASK_ENV", "development")
    origins = _ORIGINS_BY_ENV.get(env, _ORIGINS_BY_ENV["development"]).copy()
    extra = os.environ.get("CORS_EXTRA_ORIGINS", "")
    if extra:
        origins += [o.strip() for o in extra.split(",") if o.strip()]
    return origins


def _wildcard_pattern() -> re.Pattern | None:
    domain = os.environ.get("CORS_WILDCARD_DOMAIN", "").strip()
    if not domain:
        return None
    return re.compile(rf"^https://([a-z0-9-]+\.)?{re.escape(domain)}$")


def _origin_allowed(origin: str) -> bool:
    if not origin:
        return False
    if origin in _allowed_origins():
        return True
    pattern = _wildcard_pattern()
    return bool(pattern and pattern.match(origin))


def init_cors(app) -> None:
    @app.before_request
    def handle_preflight():
        if request.method != "OPTIONS":
            return None
        origin = request.headers.get("Origin", "")
        if not _origin_allowed(origin):
            return None
        res = Response(status=204)
        res.headers["Access-Control-Allow-Origin"] = origin
        for k, v in _CORS_HEADERS.items():
            res.headers[k] = v
        return res

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin", "")
        if _origin_allowed(origin):
            response.headers["Access-Control-Allow-Origin"] = origin
            for k, v in _CORS_HEADERS.items():
                response.headers[k] = v
        return response
