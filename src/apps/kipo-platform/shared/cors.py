import os
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


def init_cors(app) -> None:
    @app.before_request
    def handle_preflight():
        if request.method != "OPTIONS":
            return None
        origin = request.headers.get("Origin", "")
        if origin not in _allowed_origins():
            return None
        res = Response(status=204)
        res.headers["Access-Control-Allow-Origin"] = origin
        for k, v in _CORS_HEADERS.items():
            res.headers[k] = v
        return res

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin", "")
        if origin in _allowed_origins():
            response.headers["Access-Control-Allow-Origin"] = origin
            for k, v in _CORS_HEADERS.items():
                response.headers[k] = v
        return response
