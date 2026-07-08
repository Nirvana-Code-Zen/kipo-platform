from abc import ABC, abstractmethod
from customer.customer import Customer


class ICustomerRepository(ABC):

    @abstractmethod
    def save(self, customer: Customer, schema_name: str) -> Customer: ...
