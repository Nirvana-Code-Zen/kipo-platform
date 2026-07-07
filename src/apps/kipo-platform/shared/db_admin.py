import os
import psycopg2
from psycopg2.extensions import connection


def admin_connection() -> connection:
    return psycopg2.connect(os.environ["DATABASE_URL"])
