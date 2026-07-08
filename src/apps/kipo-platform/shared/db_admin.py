import os
import psycopg2
from psycopg2.extensions import connection


def admin_connection() -> connection:
    url = os.environ["DATABASE_URL"]
    if "sslmode" not in url:
        url += ("&" if "?" in url else "?") + "sslmode=disable"
    return psycopg2.connect(url)
