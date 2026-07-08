import json
from psycopg2 import sql
from supabase import Client
from invoice.repository import IInvoiceRepository
from invoice.invoice import Invoice
from invoice.invoice_concept import InvoiceConcept
from shared.db_admin import admin_connection

SCHEMA_SQL = """
-- Run per tenant schema (replace {schema} with actual schema name)
CREATE TABLE IF NOT EXISTS {schema}.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio_num INTEGER NOT NULL DEFAULT 1,
    series VARCHAR(10),
    voucher_type VARCHAR(2) NOT NULL,
    payment_method VARCHAR(3) NOT NULL,
    payment_form VARCHAR(2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'MXN',
    export_type VARCHAR(2) NOT NULL DEFAULT '01',
    issuer_zip VARCHAR(5) NOT NULL,
    receiver_tax_id VARCHAR(13) NOT NULL,
    receiver_name VARCHAR(254) NOT NULL,
    receiver_zip VARCHAR(5),
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    iva NUMERIC(12,2) NOT NULL DEFAULT 0,
    total NUMERIC(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS {schema}.invoice_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES {schema}.invoices(id) ON DELETE CASCADE,
    product_service_code VARCHAR(20) NOT NULL,
    unit_code VARCHAR(10) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    quantity NUMERIC(14,6) NOT NULL,
    unit_price NUMERIC(14,6) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    tax_object VARCHAR(2) NOT NULL DEFAULT '02',
    iva_rate NUMERIC(5,2),
    iva_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
"""


def _format_folio(series: str | None, folio_num: int) -> str:
    return f"{series}-{folio_num:04d}" if series else f"F-{folio_num:04d}"


class SupabaseInvoiceRepository(IInvoiceRepository):

    def __init__(self, client: Client) -> None:
        self._client = client

    def save(self, invoice: Invoice, schema_name: str) -> Invoice:
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT stamps FROM public.tenants WHERE schema_name = %s FOR UPDATE",
                    (schema_name,),
                )
                row = cur.fetchone()
                available = row[0] if row else 0
                status = "stamped" if available > 0 else "draft"
                cur.execute(
                    sql.SQL(
                        "SELECT COALESCE(MAX(t.folio_num), 0) + 1 FROM (SELECT folio_num FROM {schema}.invoices FOR UPDATE) AS t"
                    ).format(schema=schema)
                )
                folio_num = cur.fetchone()[0]
                cur.execute(
                    sql.SQL("""
                        INSERT INTO {schema}.invoices
                            (id, folio_num, series, voucher_type, payment_method, payment_form,
                             currency, export_type, issuer_zip, customer_id, receiver,
                             subtotal, iva, total, status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING created_at
                    """).format(schema=schema),
                    (
                        invoice.id,
                        folio_num,
                        invoice.series,
                        invoice.voucher_type,
                        invoice.payment_method,
                        invoice.payment_form,
                        invoice.currency,
                        invoice.export_type,
                        invoice.issuer_zip,
                        invoice.customer_id,
                        json.dumps(invoice.receiver),
                        invoice.subtotal,
                        invoice.iva,
                        invoice.total,
                        status,
                    ),
                )
                created_at = cur.fetchone()[0]
                for concept in invoice.concepts:
                    cur.execute(
                        sql.SQL("""
                            INSERT INTO {schema}.invoice_concepts
                                (id, invoice_id, product_service_code, unit_code, description,
                                 quantity, unit_price, amount, tax_object, iva_rate, iva_amount, ordinal)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """).format(schema=schema),
                        (
                            concept.id,
                            invoice.id,
                            concept.product_service_code,
                            concept.unit_code,
                            concept.description,
                            concept.quantity,
                            concept.unit_price,
                            concept.amount,
                            concept.tax_object,
                            concept.iva_rate,
                            concept.iva_amount,
                            concept.ordinal,
                        ),
                    )
                if status == "stamped":
                    cur.execute(
                        "UPDATE public.tenants SET stamps = stamps - 1 WHERE schema_name = %s",
                        (schema_name,),
                    )
            conn.commit()
        return Invoice(
            id=invoice.id,
            series=invoice.series,
            folio=_format_folio(invoice.series, folio_num),
            voucher_type=invoice.voucher_type,
            payment_method=invoice.payment_method,
            payment_form=invoice.payment_form,
            currency=invoice.currency,
            export_type=invoice.export_type,
            issuer_zip=invoice.issuer_zip,
            customer_id=invoice.customer_id,
            receiver=invoice.receiver,
            subtotal=invoice.subtotal,
            iva=invoice.iva,
            total=invoice.total,
            status=status,
            concepts=invoice.concepts,
            created_at=created_at.isoformat(),
        )

    def find_all(self, schema_name: str, limit: int, offset: int) -> list[Invoice]:
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        SELECT id, folio_num, series, voucher_type, payment_method, payment_form,
                               currency, export_type, issuer_zip, customer_id, receiver,
                               subtotal, iva, total, status, created_at
                        FROM {schema}.invoices
                        ORDER BY created_at DESC
                        LIMIT %s OFFSET %s
                    """).format(schema=schema),
                    (limit, offset),
                )
                rows = cur.fetchall()
                invoices = [self._build_invoice(cur, schema, row) for row in rows]
        return invoices

    def find_by_id(self, invoice_id: str, schema_name: str) -> Invoice:
        from shared.exceptions import NotFound
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        SELECT id, folio_num, series, voucher_type, payment_method, payment_form,
                               currency, export_type, issuer_zip, customer_id, receiver,
                               subtotal, iva, total, status, created_at
                        FROM {schema}.invoices
                        WHERE id = %s
                    """).format(schema=schema),
                    (invoice_id,),
                )
                row = cur.fetchone()
                if row is None:
                    raise NotFound(f"Factura {invoice_id} no encontrada.")
                invoice = self._build_invoice(cur, schema, row)
        return invoice

    def cancel(self, invoice_id: str, schema_name: str) -> None:
        from shared.exceptions import NotFound
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        UPDATE {schema}.invoices
                        SET status = 'cancelled', updated_at = now()
                        WHERE id = %s
                        RETURNING id
                    """).format(schema=schema),
                    (invoice_id,),
                )
                if cur.fetchone() is None:
                    conn.rollback()
                    raise NotFound(f"Factura {invoice_id} no encontrada.")
            conn.commit()

    def delete(self, invoice_id: str, schema_name: str) -> None:
        from shared.exceptions import NotFound
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("DELETE FROM {schema}.invoices WHERE id = %s RETURNING id")
                    .format(schema=schema),
                    (invoice_id,),
                )
                if cur.fetchone() is None:
                    conn.rollback()
                    raise NotFound(f"Factura {invoice_id} no encontrada.")
            conn.commit()

    def count_by_status(self, schema_name: str, status: str) -> int:
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("SELECT COUNT(*) FROM {schema}.invoices WHERE status = %s").format(schema=schema),
                    (status,),
                )
                return cur.fetchone()[0]

    def _build_invoice(self, cur, schema, row) -> Invoice:
        cur.execute(
            sql.SQL("""
                SELECT id, invoice_id, product_service_code, unit_code, description,
                       quantity, unit_price, amount, tax_object, iva_rate, iva_amount, ordinal
                FROM {schema}.invoice_concepts
                WHERE invoice_id = %s
                ORDER BY ordinal ASC
            """).format(schema=schema),
            (str(row[0]),),
        )
        concept_rows = cur.fetchall()
        concepts = [
            InvoiceConcept(
                id=str(c[0]),
                invoice_id=str(c[1]),
                product_service_code=c[2],
                unit_code=c[3],
                description=c[4],
                quantity=float(c[5]),
                unit_price=float(c[6]),
                amount=float(c[7]),
                tax_object=c[8],
                iva_rate=float(c[9]) if c[9] is not None else None,
                iva_amount=float(c[10]),
                ordinal=c[11],
            )
            for c in concept_rows
        ]
        receiver = row[10] if isinstance(row[10], dict) else json.loads(row[10])
        return Invoice(
            id=str(row[0]),
            series=row[2],
            folio=_format_folio(row[2], row[1]),
            voucher_type=row[3],
            payment_method=row[4],
            payment_form=row[5],
            currency=row[6],
            export_type=row[7],
            issuer_zip=row[8],
            customer_id=str(row[9]) if row[9] else None,
            receiver=receiver,
            subtotal=float(row[11]),
            iva=float(row[12]),
            total=float(row[13]),
            status=row[14],
            concepts=concepts,
            created_at=row[15].isoformat(),
        )
