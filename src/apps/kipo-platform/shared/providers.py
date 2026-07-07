from flask import g
from shared import supabase
from auth.infrastructure.supabase_repository import SupabaseAuthRepository
from tenant.infrastructure.supabase_repository import SupabaseTenantRepository


def get_auth_repo() -> SupabaseAuthRepository:
    if "auth_repo" not in g:
        g.auth_repo = SupabaseAuthRepository(supabase.get_client())
    return g.auth_repo


def get_tenant_repo() -> SupabaseTenantRepository:
    if "tenant_repo" not in g:
        g.tenant_repo = SupabaseTenantRepository(supabase.get_client())
    return g.tenant_repo
