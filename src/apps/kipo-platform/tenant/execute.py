from typing import Any
from tenant.commands import RegisterTenantCommand, UpdateTenantPlanCommand
from tenant.operations import register, update_plan
from shared.providers import get_tenant_repo
from shared.exceptions import BusinessRuleViolation


def execute(command: Any) -> Any:
    repo = get_tenant_repo()
    match command:
        case RegisterTenantCommand(
            auth_id, name, schema_name, plan_type, timezone, currency,
            storage_quota_bytes, features_enabled
        ):
            return register.execute(
                repo, auth_id, name, schema_name, plan_type,
                timezone, currency, storage_quota_bytes, features_enabled,
            )
        case UpdateTenantPlanCommand(tenant_id, plan_type, status, features_enabled):
            return update_plan.execute(repo, tenant_id, plan_type, status, features_enabled)
        case _:
            raise BusinessRuleViolation(f"Unknown tenant command: {type(command).__name__}")
