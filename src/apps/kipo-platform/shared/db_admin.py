import os
import psycopg2
from psycopg2.extensions import connection


def admin_connection() -> connection:
    url = os.environ["DATABASE_URL"]
    if "sslmode" not in url:
        is_local = "127.0.0.1" in url or "localhost" in url
        default_sslmode = "disable" if is_local else "verify-full"
        url += ("&" if "?" in url else "?") + f"sslmode={default_sslmode}"
    return psycopg2.connect(url)
