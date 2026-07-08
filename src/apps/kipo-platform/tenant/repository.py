from abc import ABC, abstractmethod
from tenant.tenant import Tenant


class ITenantRepository(ABC):

    @abstractmethod
    def save(self, tenant: Tenant) -> Tenant: ...

    @abstractmethod
    def provision_schema(self, schema_name: str) -> None: ...

    @abstractmethod
    def find_by_auth_id(self, auth_id: str) -> Tenant | None: ...
