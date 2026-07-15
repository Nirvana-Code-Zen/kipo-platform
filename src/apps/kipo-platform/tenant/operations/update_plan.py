from tenant.repository import ITenantRepository
from tenant.value_objects.tenant_id import TenantId
from tenant.value_objects.plan_type import PlanType
from tenant.value_objects.tenant_status import TenantStatus


def execute(
    repo: ITenantRepository,
    raw_tenant_id: str,
    raw_plan_type: str,
    raw_status: str,
    features_enabled: tuple[str, ...],
) -> None:
    repo.update_plan(
        TenantId(raw_tenant_id),
        PlanType(raw_plan_type),
        TenantStatus(raw_status),
        features_enabled,
    )
