from supabase import Client
from stamp_packs.repository import IStampPackRepository
from shared.db_admin import admin_connection


class SupabaseStampPackRepository(IStampPackRepository):
    def __init__(self, client: Client) -> None:
        self._client = client

    def has_processed(self, stripe_checkout_session_id: str) -> bool:
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT 1 FROM public.stamp_purchases WHERE stripe_checkout_session_id = %s",
                    (stripe_checkout_session_id,),
                )
                return cur.fetchone() is not None

    def record_purchase(
        self,
        tenant_id: str,
        pack_id: str,
        qty: int,
        amount_cents: int,
        stripe_checkout_session_id: str,
    ) -> None:
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO public.stamp_purchases
                        (tenant_id, pack_id, qty, amount_cents, stripe_checkout_session_id)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (stripe_checkout_session_id) DO NOTHING
                    """,
                    (tenant_id, pack_id, qty, amount_cents, stripe_checkout_session_id),
                )
            conn.commit()

    def credit_stamps(self, tenant_id: str, qty: int) -> None:
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE public.tenants SET stamps = stamps + %s WHERE id = %s",
                    (qty, tenant_id),
                )
            conn.commit()
