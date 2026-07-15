from abc import ABC, abstractmethod
from tenant.tenant import Tenant
from tenant.value_objects.tenant_id import TenantId
from tenant.value_objects.plan_type import PlanType
from tenant.value_objects.tenant_status import TenantStatus


class ITenantRepository(ABC):

    @abstractmethod
    def save(self, tenant: Tenant) -> Tenant: ...

    @abstractmethod
    def provision_schema(self, schema_name: str) -> None: ...

    @abstractmethod
    def find_by_auth_id(self, auth_id: str) -> Tenant | None: ...

    @abstractmethod
    def find_by_schema_name(self, schema_name: str) -> Tenant | None: ...

    @abstractmethod
    def update_plan(
        self,
        tenant_id: TenantId,
        plan_type: PlanType,
        status: TenantStatus,
        features_enabled: tuple[str, ...],
    ) -> None: ...
