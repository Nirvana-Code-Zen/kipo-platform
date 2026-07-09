from psycopg2 import sql
from supabase import Client
from emisor.repository import IEmisorRepository
from emisor.emisor import Emisor
from shared.db_admin import admin_connection


class SupabaseEmisorRepository(IEmisorRepository):

    def __init__(self, client: Client) -> None:
        self._client = client

    def find(self, schema_name: str) -> Emisor | None:
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        SELECT id, rfc, razon_social, regimen_fiscal, codigo_postal,
                               series, folio_siguiente, created_at, updated_at
                        FROM {schema}.emisor
                        LIMIT 1
                    """).format(schema=schema)
                )
                row = cur.fetchone()
        if row is None:
            return None
        return self._build_emisor(row)

    def upsert(
        self,
        schema_name: str,
        rfc: str,
        razon_social: str,
        regimen_fiscal: str,
        codigo_postal: str,
        series: str | None,
    ) -> Emisor:
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("SELECT id FROM {schema}.emisor LIMIT 1").format(schema=schema)
                )
                existing = cur.fetchone()
                if existing:
                    cur.execute(
                        sql.SQL("""
                            UPDATE {schema}.emisor
                            SET rfc = %s,
                                razon_social = %s,
                                regimen_fiscal = %s,
                                codigo_postal = %s,
                                series = %s,
                                updated_at = NOW()
                            WHERE id = %s
                            RETURNING id, rfc, razon_social, regimen_fiscal, codigo_postal,
                                      series, folio_siguiente, created_at, updated_at
                        """).format(schema=schema),
                        (rfc, razon_social, regimen_fiscal, codigo_postal, series, str(existing[0])),
                    )
                else:
                    cur.execute(
                        sql.SQL("""
                            INSERT INTO {schema}.emisor
                                (rfc, razon_social, regimen_fiscal, codigo_postal, series)
                            VALUES (%s, %s, %s, %s, %s)
                            RETURNING id, rfc, razon_social, regimen_fiscal, codigo_postal,
                                      series, folio_siguiente, created_at, updated_at
                        """).format(schema=schema),
                        (rfc, razon_social, regimen_fiscal, codigo_postal, series),
                    )
                row = cur.fetchone()
            conn.commit()
        return self._build_emisor(row)

    def next_folio(self, schema_name: str) -> tuple[int, str | None]:
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        UPDATE {schema}.emisor
                        SET folio_siguiente = folio_siguiente + 1,
                            updated_at = NOW()
                        WHERE id = (SELECT id FROM {schema}.emisor LIMIT 1)
                        RETURNING folio_siguiente - 1, series
                    """).format(schema=schema)
                )
                row = cur.fetchone()
                if row is None:
                    conn.rollback()
                    return (1, None)
            conn.commit()
        return (int(row[0]), row[1])

    def _build_emisor(self, row: tuple) -> Emisor:
        return Emisor(
            id=str(row[0]),
            rfc=row[1],
            razon_social=row[2],
            regimen_fiscal=row[3],
            codigo_postal=row[4],
            series=row[5],
            folio_siguiente=row[6],
            created_at=row[7].isoformat(),
            updated_at=row[8].isoformat(),
        )
