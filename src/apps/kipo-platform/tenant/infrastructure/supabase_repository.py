from psycopg2 import sql
from supabase import Client
from tenant.repository import ITenantRepository
from tenant.tenant import Tenant
from tenant.value_objects.tenant_id import TenantId
from tenant.value_objects.plan_type import PlanType
from tenant.value_objects.tenant_status import TenantStatus
from shared.db_admin import admin_connection


class SupabaseTenantRepository(ITenantRepository):

    def __init__(self, client: Client) -> None:
        self._client = client

    def save(self, tenant: Tenant) -> Tenant:
        self._client.table("tenants").insert({
            "id": str(tenant.id),
            "name": tenant.name,
            "schema_name": tenant.schema_name,
            "plan_type": tenant.plan_type.value,
            "status": tenant.status.value,
            "features_enabled": list(tenant.features_enabled),
            "timezone": tenant.timezone,
            "currency": tenant.currency,
            "storage_quota_bytes": tenant.storage_quota_bytes,
        }).execute()

        self._client.table("tenant_users").insert({
            "tenant_id": str(tenant.id),
            "user_id": str(tenant.auth_id),
            "role": "owner",
        }).execute()

        return tenant

    def provision_schema(self, schema_name: str) -> None:
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql.SQL("CREATE SCHEMA IF NOT EXISTS {}").format(schema))
                cur.execute(sql.SQL("""
                    CREATE TABLE IF NOT EXISTS {}.employees (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        role TEXT,
                        created_at TIMESTAMPTZ DEFAULT now()
                    )
                """).format(schema))
                cur.execute(sql.SQL("""
                    CREATE TABLE IF NOT EXISTS {}.bills (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        amount NUMERIC(10, 2) NOT NULL,
                        status TEXT DEFAULT 'unpaid',
                        issued_at TIMESTAMPTZ DEFAULT now(),
                        due_at TIMESTAMPTZ
                    )
                """).format(schema))
            conn.commit()

    def find_by_auth_id(self, auth_id: str) -> Tenant | None:
        response = (
            self._client.table("tenant_users")
            .select("tenant_id, role, tenants(*)")
            .eq("user_id", auth_id)
            .eq("role", "owner")
            .maybe_single()
            .execute()
        )
        if not response.data:
            return None
        return self._to_tenant(response.data["tenants"], auth_id)

    def _to_tenant(self, row: dict, auth_id: str = "") -> Tenant:
        return Tenant(
            id=TenantId(row["id"]),
            auth_id=TenantId(auth_id),
            name=row["name"],
            schema_name=row["schema_name"],
            plan_type=PlanType(row["plan_type"]),
            status=TenantStatus(row["status"]),
            features_enabled=tuple(row.get("features_enabled") or []),
            timezone=row["timezone"],
            currency=row["currency"],
            storage_quota_bytes=row["storage_quota_bytes"],
        )
