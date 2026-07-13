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
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO public.tenants
                        (id, name, schema_name, plan_type, status, features_enabled, timezone, currency, storage_quota_bytes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        str(tenant.id),
                        tenant.name,
                        tenant.schema_name,
                        tenant.plan_type.value,
                        tenant.status.value,
                        list(tenant.features_enabled),
                        tenant.timezone,
                        tenant.currency,
                        tenant.storage_quota_bytes,
                    ),
                )
                cur.execute(
                    """
                    INSERT INTO public.tenant_users (tenant_id, user_id, role)
                    VALUES (%s, %s, %s)
                    """,
                    (str(tenant.id), str(tenant.auth_id), "owner"),
                )
            conn.commit()
        return tenant

    def provision_schema(self, schema_name: str) -> None:
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql.SQL("CREATE SCHEMA IF NOT EXISTS {}").format(schema))
                cur.execute(
                    sql.SQL("""
                    CREATE TABLE IF NOT EXISTS {}.customers (
                        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
                        tax_id      TEXT        NOT NULL UNIQUE,
                        legal_name  TEXT        NOT NULL,
                        tax_regime  TEXT        NOT NULL,
                        zip         TEXT        NOT NULL,
                        email       TEXT        NOT NULL,
                        is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
                        avatar_url  TEXT,
                        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
                    )
                """).format(schema)
                )
                cur.execute(
                    sql.SQL("""
                    CREATE TABLE IF NOT EXISTS {}.employees (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        role TEXT,
                        created_at TIMESTAMPTZ DEFAULT now()
                    )
                """).format(schema)
                )
                cur.execute(
                    sql.SQL("""
                    CREATE TABLE IF NOT EXISTS {schema}.emisor (
                        id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
                        rfc                         VARCHAR(13) NOT NULL,
                        razon_social                TEXT        NOT NULL,
                        regimen_fiscal              VARCHAR(3)  NOT NULL,
                        codigo_postal               VARCHAR(5)  NOT NULL,
                        series                      VARCHAR(10),
                        folio_siguiente             INTEGER     NOT NULL DEFAULT 1,
                        facturapi_organization_id   TEXT,
                        csd_configured              BOOLEAN     NOT NULL DEFAULT FALSE,
                        csd_configured_at           TIMESTAMPTZ,
                        manifiesto_signed           BOOLEAN     NOT NULL DEFAULT FALSE,
                        manifiesto_signed_at        TIMESTAMPTZ,
                        custom_section_html         TEXT,
                        display_options             JSONB       NOT NULL DEFAULT '{}'::jsonb,
                        logo_path                   TEXT,
                        created_at                  TIMESTAMPTZ DEFAULT NOW(),
                        updated_at                  TIMESTAMPTZ DEFAULT NOW()
                    )
                """).format(schema=schema)
                )
                cur.execute(
                    sql.SQL("""
                    CREATE TABLE IF NOT EXISTS {schema}.invoices (
                        id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
                        folio_num       INTEGER         NOT NULL DEFAULT 1,
                        series          VARCHAR(10),
                        voucher_type    VARCHAR(2)      NOT NULL,
                        payment_method  VARCHAR(3)      NOT NULL,
                        payment_form    VARCHAR(2)      NOT NULL,
                        currency        VARCHAR(3)      NOT NULL DEFAULT 'MXN',
                        export_type     VARCHAR(2)      NOT NULL DEFAULT '01',
                        issuer_zip      VARCHAR(5)      NOT NULL,
                        customer_id     UUID            REFERENCES {schema}.customers(id) ON DELETE SET NULL,
                        receiver        JSONB           NOT NULL,
                        subtotal        NUMERIC(12,2)   NOT NULL DEFAULT 0,
                        iva             NUMERIC(12,2)   NOT NULL DEFAULT 0,
                        total           NUMERIC(12,2)   NOT NULL DEFAULT 0,
                        status          VARCHAR(20)     NOT NULL DEFAULT 'draft',
                        created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
                        updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
                    )
                """).format(schema=schema)
                )
                cur.execute(
                    sql.SQL("""
                    CREATE TABLE IF NOT EXISTS {schema}.invoice_concepts (
                        id                   UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
                        invoice_id           UUID            NOT NULL REFERENCES {schema}.invoices(id) ON DELETE CASCADE,
                        product_service_code VARCHAR(20)     NOT NULL,
                        unit_code            VARCHAR(10)     NOT NULL,
                        description          VARCHAR(1000)   NOT NULL,
                        quantity             NUMERIC(14,6)   NOT NULL,
                        unit_price           NUMERIC(14,6)   NOT NULL,
                        amount               NUMERIC(12,2)   NOT NULL,
                        tax_object           VARCHAR(2)      NOT NULL DEFAULT '02',
                        iva_rate             NUMERIC(5,2),
                        iva_amount           NUMERIC(12,2)   NOT NULL DEFAULT 0,
                        ordinal              SMALLINT        NOT NULL DEFAULT 0,
                        created_at           TIMESTAMPTZ     NOT NULL DEFAULT now()
                    )
                """).format(schema=schema)
                )
            conn.commit()

    def find_by_auth_id(self, auth_id: str) -> Tenant | None:
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT t.id, t.name, t.schema_name, t.plan_type, t.status,
                           t.features_enabled, t.timezone, t.currency, t.storage_quota_bytes
                    FROM public.tenant_users tu
                    JOIN public.tenants t ON t.id = tu.tenant_id
                    WHERE tu.user_id = %s AND tu.role = 'owner'
                    LIMIT 1
                    """,
                    (auth_id,),
                )
                row = cur.fetchone()
        if not row:
            return None
        return self._to_tenant_from_row(row, auth_id)

    def _to_tenant_from_row(self, row: tuple, auth_id: str) -> Tenant:
        (
            id_,
            name,
            schema_name,
            plan_type,
            status,
            features_enabled,
            timezone,
            currency,
            storage_quota_bytes,
        ) = row
        return Tenant(
            id=TenantId(str(id_)),
            auth_id=TenantId(auth_id),
            name=name,
            schema_name=schema_name,
            plan_type=PlanType(plan_type),
            status=TenantStatus(status),
            features_enabled=tuple(features_enabled or []),
            timezone=timezone,
            currency=currency,
            storage_quota_bytes=storage_quota_bytes,
        )

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
