import os
from contextlib import contextmanager
from typing import Iterator

from psycopg2 import pool
from psycopg2.extensions import connection

_pool: pool.ThreadedConnectionPool | None = None


def _build_url() -> str:
    url = os.environ["DATABASE_URL"]
    if "sslmode" not in url:
        is_local = "127.0.0.1" in url or "localhost" in url
        default_sslmode = "disable" if is_local else "verify-full"
        url += ("&" if "?" in url else "?") + f"sslmode={default_sslmode}"
    return url


def _get_pool() -> pool.ThreadedConnectionPool:
    global _pool
    if _pool is None:
        _pool = pool.ThreadedConnectionPool(1, 5, _build_url())
    return _pool


@contextmanager
def admin_connection() -> Iterator[connection]:
    p = _get_pool()
    conn = p.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        p.putconn(conn, close=conn.closed != 0)
