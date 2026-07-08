from dataclasses import dataclass
from tenant.value_objects.tenant_id import TenantId
from tenant.value_objects.plan_type import PlanType
from tenant.value_objects.tenant_status import TenantStatus


@dataclass(frozen=True)
class Tenant:
    id: TenantId
    auth_id: TenantId      # owner user_id — used for tenant_users insert, not stored in tenants
    name: str              # display name
    schema_name: str       # postgres schema identifier (e.g. "tenant_acme-corp")
    plan_type: PlanType
    status: TenantStatus
    features_enabled: tuple[str, ...]
    timezone: str
    currency: str
    storage_quota_bytes: int
