from flask import g, current_app
from shared import supabase
from auth.infrastructure.supabase_repository import SupabaseAuthRepository
from auth.infrastructure.exchange_code_repository import ExchangeCodeRepository
from tenant.infrastructure.supabase_repository import SupabaseTenantRepository
from customer.infrastructure.supabase_repository import SupabaseCustomerRepository
from invoice.infrastructure.supabase_repository import SupabaseInvoiceRepository
from emisor.infrastructure.supabase_repository import SupabaseEmisorRepository
from emisor.pac_client import IPacClient
from shared.infrastructure.facturapi_pac_client import FakeFacturapiPacClient
from catalog.infrastructure.supabase_repository import SupabaseCatalogRepository
from subscriptions.infrastructure.supabase_repository import SupabaseSubscriptionRepository
from shared.infrastructure.stripe_gateway import StripePaymentGateway
from shared.payment_gateway import IPaymentGateway
from stamp_packs.infrastructure.supabase_repository import SupabaseStampPackRepository


def get_auth_repo() -> SupabaseAuthRepository:
    if "auth_repo" not in g:
        g.auth_repo = SupabaseAuthRepository(supabase.get_client())
    return g.auth_repo


def get_exchange_code_repo() -> ExchangeCodeRepository:
    if "exchange_code_repo" not in g:
        g.exchange_code_repo = ExchangeCodeRepository()
    return g.exchange_code_repo


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


def get_emisor_repo() -> SupabaseEmisorRepository:
    if "emisor_repo" not in g:
        g.emisor_repo = SupabaseEmisorRepository(supabase.get_client())
    return g.emisor_repo


def get_pac_client() -> IPacClient:
    if "pac_client" not in g:
        g.pac_client = FakeFacturapiPacClient()
    return g.pac_client


def get_catalog_repo() -> SupabaseCatalogRepository:
    if "catalog_repo" not in g:
        g.catalog_repo = SupabaseCatalogRepository(supabase.get_client())
    return g.catalog_repo


def get_subscription_repo() -> SupabaseSubscriptionRepository:
    if "subscription_repo" not in g:
        g.subscription_repo = SupabaseSubscriptionRepository(supabase.get_client())
    return g.subscription_repo


def get_payment_gateway() -> IPaymentGateway:
    if "payment_gateway" not in g:
        g.payment_gateway = StripePaymentGateway(current_app.config["STRIPE_SECRET_KEY"])
    return g.payment_gateway


def get_stamp_pack_repo() -> SupabaseStampPackRepository:
    if "stamp_pack_repo" not in g:
        g.stamp_pack_repo = SupabaseStampPackRepository(supabase.get_client())
    return g.stamp_pack_repo
