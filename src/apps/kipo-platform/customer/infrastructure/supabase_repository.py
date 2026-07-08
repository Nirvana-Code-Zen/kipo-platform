from psycopg2 import sql, errors as pg_errors
from supabase import Client
from customer.repository import ICustomerRepository
from customer.customer import Customer
from customer.value_objects.customer_id import CustomerId
from customer.value_objects.tax_id import TaxId
from customer.value_objects.legal_name import LegalName
from customer.value_objects.tax_regime import TaxRegime
from customer.value_objects.zip_code import ZipCode
from customer.value_objects.cfdi_use import CfdiUse
from shared.db_admin import admin_connection


class SupabaseCustomerRepository(ICustomerRepository):

    def __init__(self, client: Client) -> None:
        self._client = client

    def save(self, customer: Customer, schema_name: str) -> Customer:
        from shared.exceptions import BusinessRuleViolation
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        sql.SQL("""
                            INSERT INTO {schema}.customers
                                (id, tax_id, legal_name, tax_regime, zip, cfdi_use, email, is_active, avatar_url)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                            RETURNING id
                        """).format(schema=schema),
                        (
                            str(customer.id),
                            str(customer.tax_id),
                            str(customer.legal_name),
                            str(customer.tax_regime),
                            str(customer.zip),
                            str(customer.cfdi_use),
                            customer.email,
                            customer.is_active,
                            customer.avatar_url,
                        ),
                    )
                except pg_errors.UniqueViolation:
                    conn.rollback()
                    raise BusinessRuleViolation(
                        f"Ya existe un cliente con el RFC {customer.tax_id} en este tenant."
                    )
                row = cur.fetchone()
            conn.commit()
        return Customer(
            id=CustomerId(str(row[0])),
            tax_id=customer.tax_id,
            legal_name=customer.legal_name,
            tax_regime=customer.tax_regime,
            zip=customer.zip,
            cfdi_use=customer.cfdi_use,
            email=customer.email,
            is_active=customer.is_active,
            avatar_url=customer.avatar_url,
        )

    def find_all(self, schema_name: str, limit: int, offset: int) -> list[Customer]:
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        SELECT id, tax_id, legal_name, tax_regime, zip, cfdi_use, email, is_active, avatar_url
                        FROM {schema}.customers
                        ORDER BY created_at DESC
                        LIMIT %s OFFSET %s
                    """).format(schema=schema),
                    (limit, offset),
                )
                rows = cur.fetchall()
        return [
            Customer(
                id=CustomerId(str(row[0])),
                tax_id=TaxId(row[1]),
                legal_name=LegalName(row[2]),
                tax_regime=TaxRegime(row[3]),
                zip=ZipCode(row[4]),
                cfdi_use=CfdiUse(row[5]),
                email=row[6],
                is_active=row[7],
                avatar_url=row[8],
            )
            for row in rows
        ]

    def update(self, customer_id: str, fields: dict, schema_name: str) -> Customer:
        from shared.exceptions import BusinessRuleViolation, NotFound
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        sql.SQL("""
                            UPDATE {schema}.customers
                            SET tax_id = %s,
                                legal_name = %s,
                                tax_regime = %s,
                                zip = %s,
                                cfdi_use = %s,
                                email = %s,
                                avatar_url = %s,
                                updated_at = now()
                            WHERE id = %s
                            RETURNING id, tax_id, legal_name, tax_regime, zip, cfdi_use, email, is_active, avatar_url
                        """).format(schema=schema),
                        (
                            fields["tax_id"],
                            fields["legal_name"],
                            fields["tax_regime"],
                            fields["zip"],
                            fields["cfdi_use"],
                            fields["email"],
                            fields["avatar_url"],
                            customer_id,
                        ),
                    )
                except pg_errors.UniqueViolation:
                    conn.rollback()
                    raise BusinessRuleViolation(
                        f"Ya existe un cliente con el RFC {fields['tax_id']} en este tenant."
                    )
                row = cur.fetchone()
                if row is None:
                    conn.rollback()
                    raise NotFound(f"Cliente {customer_id} no encontrado.")
            conn.commit()
        return Customer(
            id=CustomerId(str(row[0])),
            tax_id=TaxId(row[1]),
            legal_name=LegalName(row[2]),
            tax_regime=TaxRegime(row[3]),
            zip=ZipCode(row[4]),
            cfdi_use=CfdiUse(row[5]),
            email=row[6],
            is_active=row[7],
            avatar_url=row[8],
        )

    def deactivate(self, customer_id: str, schema_name: str) -> None:
        from shared.exceptions import NotFound
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        UPDATE {schema}.customers
                        SET is_active = false, updated_at = now()
                        WHERE id = %s
                        RETURNING id
                    """).format(schema=schema),
                    (customer_id,),
                )
                row = cur.fetchone()
                if row is None:
                    conn.rollback()
                    raise NotFound(f"Cliente {customer_id} no encontrado.")
            conn.commit()

    def delete(self, customer_id: str, schema_name: str) -> None:
        from shared.exceptions import NotFound
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("DELETE FROM {schema}.customers WHERE id = %s RETURNING id")
                    .format(schema=schema),
                    (customer_id,),
                )
                if cur.fetchone() is None:
                    conn.rollback()
                    raise NotFound(f"Cliente {customer_id} no encontrado.")
            conn.commit()

    def activate(self, customer_id: str, schema_name: str) -> None:
        from shared.exceptions import NotFound
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("""
                        UPDATE {schema}.customers
                        SET is_active = true, updated_at = now()
                        WHERE id = %s
                        RETURNING id
                    """).format(schema=schema),
                    (customer_id,),
                )
                row = cur.fetchone()
                if row is None:
                    conn.rollback()
                    raise NotFound(f"Cliente {customer_id} no encontrado.")
            conn.commit()
