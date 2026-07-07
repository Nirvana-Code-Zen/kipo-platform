from uuid import uuid4
from tenant.repository import ITenantRepository
from tenant.tenant import Tenant
from tenant.value_objects.tenant_id import TenantId
from tenant.value_objects.tenant_name import TenantName
from tenant.value_objects.plan_type import PlanType
from tenant.value_objects.tenant_status import TenantStatus


def execute(
    repo: ITenantRepository,
    raw_auth_id: str,
    raw_tenant_name: str,
    raw_plan_type: str,
    timezone: str,
    currency: str,
    storage_quota_bytes: int,
    features_enabled: tuple[str, ...],
) -> Tenant:
    tenant = Tenant(
        id=TenantId(str(uuid4())),
        auth_id=TenantId(raw_auth_id),
        tenant_name=TenantName(raw_tenant_name),
        plan_type=PlanType(raw_plan_type),
        status=TenantStatus.TRIAL,
        features_enabled=features_enabled,
        timezone=timezone,
        currency=currency,
        storage_quota_bytes=storage_quota_bytes,
    )
    saved = repo.save(tenant)
    repo.provision_schema(saved.tenant_name)
    return saved
