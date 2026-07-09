import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from shared.db_admin import admin_connection
from shared.exceptions import TokenTheftDetected, TokenFamilyRevoked

_TOKEN_TTL = timedelta(days=30)


def _hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def create_rotation_token(
    supabase_refresh_token: str,
    user_id: str,
    family_id: str,
) -> str:
    raw_token = secrets.token_urlsafe(48)
    token_hash = _hash_token(raw_token)
    expires_at = datetime.now(timezone.utc) + _TOKEN_TTL
    with admin_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO refresh_token_families
                    (family_id, token_hash, supabase_refresh_token, user_id, expires_at)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    str(family_id),
                    token_hash,
                    supabase_refresh_token,
                    str(user_id),
                    expires_at,
                ),
            )
        conn.commit()
    return raw_token


def consume_rotation_token(raw_token: str) -> tuple[str, str, str]:
    token_hash = _hash_token(raw_token)
    with admin_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT family_id, supabase_refresh_token, user_id, used, revoked
                FROM refresh_token_families
                WHERE token_hash = %s
                """,
                (token_hash,),
            )
            row = cur.fetchone()
            if row is None:
                raise TokenTheftDetected("Unknown refresh token")

            family_id, supabase_refresh_token, user_id, used, revoked = row

            if revoked:
                raise TokenTheftDetected("Refresh token family revoked")

            if used:
                cur.execute(
                    "UPDATE refresh_token_families SET revoked = TRUE WHERE family_id = %s",
                    (str(family_id),),
                )
                conn.commit()
                raise TokenFamilyRevoked("Refresh token reuse detected")

            cur.execute(
                "UPDATE refresh_token_families SET used = TRUE WHERE token_hash = %s",
                (token_hash,),
            )
        conn.commit()
    return str(supabase_refresh_token), str(user_id), str(family_id)


def revoke_family(family_id: str) -> None:
    with admin_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE refresh_token_families SET revoked = TRUE WHERE family_id = %s",
                (str(family_id),),
            )
        conn.commit()


def revoke_token_family_by_raw(raw_token: str) -> None:
    token_hash = _hash_token(raw_token)
    with admin_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE refresh_token_families
                SET revoked = TRUE
                WHERE family_id = (
                    SELECT family_id FROM refresh_token_families WHERE token_hash = %s
                )
                """,
                (token_hash,),
            )
        conn.commit()
