from customer.repository import ICustomerRepository


def execute(repo: ICustomerRepository, schema_name: str, customer_id: str) -> None:
    repo.deactivate(customer_id, schema_name)
