import secrets
from datetime import datetime, timedelta, timezone

from shared.db_admin import admin_connection

CODE_TTL_SECONDS = 60


class ExchangeCodeRepository:

    def create(self, refresh_token: str, user_id: str) -> str:
        code = secrets.token_urlsafe(32)
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=CODE_TTL_SECONDS)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM public.auth_exchange_codes WHERE expires_at < NOW()")
                cur.execute(
                    """
                    INSERT INTO public.auth_exchange_codes (code, refresh_token, user_id, expires_at)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (code, refresh_token, user_id, expires_at),
                )
            conn.commit()
        return code

    def consume(self, code: str) -> str | None:
        """Validates and deletes the code atomically (one-time use). Returns
        the underlying refresh_token, or None if missing/expired/already used."""
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM public.auth_exchange_codes
                    WHERE code = %s AND expires_at > NOW()
                    RETURNING refresh_token
                    """,
                    (code,),
                )
                row = cur.fetchone()
            conn.commit()
        return row[0] if row else None
