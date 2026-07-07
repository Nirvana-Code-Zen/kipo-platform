from abc import ABC, abstractmethod
from tenant.tenant import Tenant
from tenant.value_objects.tenant_name import TenantName


class ITenantRepository(ABC):

    @abstractmethod
    def save(self, tenant: Tenant) -> Tenant: ...

    @abstractmethod
    def provision_schema(self, tenant_name: TenantName) -> None: ...

    @abstractmethod
    def find_by_auth_id(self, auth_id: str) -> Tenant | None: ...
