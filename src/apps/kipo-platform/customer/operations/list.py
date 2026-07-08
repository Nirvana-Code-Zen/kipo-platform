from customer.repository import ICustomerRepository
from customer.customer import Customer


def execute(
    repo: ICustomerRepository,
    schema_name: str,
    limit: int,
    offset: int,
) -> list[Customer]:
    return repo.find_all(schema_name, limit, offset)
