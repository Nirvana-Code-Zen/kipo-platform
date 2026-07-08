from psycopg2 import sql
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
        schema = sql.Identifier(schema_name)
        with admin_connection() as conn:
            with conn.cursor() as cur:
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
