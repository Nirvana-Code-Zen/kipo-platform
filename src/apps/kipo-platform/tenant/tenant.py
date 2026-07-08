from dataclasses import dataclass
from tenant.value_objects.tenant_id import TenantId
from tenant.value_objects.plan_type import PlanType
from tenant.value_objects.tenant_status import TenantStatus


@dataclass(frozen=True)
class Tenant:
    id: TenantId
    auth_id: TenantId
    name: str
    schema_name: str
    plan_type: PlanType
    status: TenantStatus
    features_enabled: tuple[str, ...]
    timezone: str
    currency: str
    storage_quota_bytes: int
