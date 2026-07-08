from flask import g
from shared import supabase
from auth.infrastructure.supabase_repository import SupabaseAuthRepository
from tenant.infrastructure.supabase_repository import SupabaseTenantRepository
from customer.infrastructure.supabase_repository import SupabaseCustomerRepository
from invoice.infrastructure.supabase_repository import SupabaseInvoiceRepository


def get_auth_repo() -> SupabaseAuthRepository:
    if "auth_repo" not in g:
        g.auth_repo = SupabaseAuthRepository(supabase.get_client())
    return g.auth_repo


def get_tenant_repo() -> SupabaseTenantRepository:
    if "tenant_repo" not in g:
        g.tenant_repo = SupabaseTenantRepository(supabase.get_client())
    return g.tenant_repo


def get_customer_repo() -> SupabaseCustomerRepository:
    if "customer_repo" not in g:
        g.customer_repo = SupabaseCustomerRepository(supabase.get_client())
    return g.customer_repo


def get_invoice_repo() -> SupabaseInvoiceRepository:
    if "invoice_repo" not in g:
        g.invoice_repo = SupabaseInvoiceRepository(supabase.get_client())
    return g.invoice_repo
