from psycopg2 import sql
from supabase import Client
from catalog.repository import ICatalogRepository
from shared.db_admin import admin_connection


class SupabaseCatalogRepository(ICatalogRepository):

    def __init__(self, client: Client) -> None:
        self._client = client

    def find_by_table(self, table_name: str) -> list[dict]:
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("SELECT * FROM public.{table} ORDER BY 1")
                    .format(table=sql.Identifier(table_name))
                )
                columns = [col.name for col in cur.description]
                rows = cur.fetchall()
        return [dict(zip(columns, row)) for row in rows]
