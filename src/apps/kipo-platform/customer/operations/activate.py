from customer.repository import ICustomerRepository


def execute(repo: ICustomerRepository, schema_name: str, customer_id: str) -> None:
    repo.activate(customer_id, schema_name)
