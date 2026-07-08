from abc import ABC, abstractmethod
from customer.customer import Customer


class ICustomerRepository(ABC):

    @abstractmethod
    def save(self, customer: Customer, schema_name: str) -> Customer: ...

    @abstractmethod
    def find_all(self, schema_name: str, limit: int, offset: int) -> list[Customer]: ...

    @abstractmethod
    def update(self, customer_id: str, fields: dict, schema_name: str) -> Customer: ...

    @abstractmethod
    def deactivate(self, customer_id: str, schema_name: str) -> None: ...

    @abstractmethod
    def activate(self, customer_id: str, schema_name: str) -> None: ...

    @abstractmethod
    def delete(self, customer_id: str, schema_name: str) -> None: ...
