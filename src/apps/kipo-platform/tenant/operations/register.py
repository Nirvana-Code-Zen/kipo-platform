import re
from uuid import uuid4
from shared.exceptions import BusinessRuleViolation
from tenant.repository import ITenantRepository
from tenant.tenant import Tenant
from tenant.value_objects.tenant_id import TenantId
from tenant.value_objects.plan_type import PlanType
from tenant.value_objects.tenant_status import TenantStatus

_VALID_SCHEMA = re.compile(r"^[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]$")


def execute(
    repo: ITenantRepository,
    raw_auth_id: str,
    name: str,
    schema_name: str,
    raw_plan_type: str,
    timezone: str,
    currency: str,
    storage_quota_bytes: int,
    features_enabled: tuple[str, ...],
) -> Tenant:
    if not name or not name.strip():
        raise BusinessRuleViolation("Business name cannot be empty.")
    if not _VALID_SCHEMA.match(schema_name):
        raise BusinessRuleViolation(
            "Schema name must be 3-50 characters, lowercase letters, numbers, and hyphens only."
        )

    tenant = Tenant(
        id=TenantId(str(uuid4())),
        auth_id=TenantId(raw_auth_id),
        name=name.strip(),
        schema_name=f"tenant_{schema_name}",
        plan_type=PlanType(raw_plan_type),
        status=TenantStatus.TRIAL,
        features_enabled=features_enabled,
        timezone=timezone,
        currency=currency,
        storage_quota_bytes=storage_quota_bytes,
    )
    saved = repo.save(tenant)
    repo.provision_schema(saved.schema_name)
    return saved
