from typing import Any
from customer.commands import (
    CreateCustomerCommand,
    UpdateCustomerCommand,
    DeactivateCustomerCommand,
    ActivateCustomerCommand,
    DeleteCustomerCommand,
    ListCustomersQuery,
)
from customer.operations import create
from customer.operations import update as update_
from customer.operations import deactivate as deactivate_
from customer.operations import activate as activate_
from customer.operations import delete as delete_
from customer.operations import list as list_
from shared.providers import get_customer_repo
from shared.exceptions import BusinessRuleViolation


def execute(command: Any) -> Any:
    repo = get_customer_repo()
    match command:
        case CreateCustomerCommand(
            schema_name, tax_id, legal_name, tax_regime, zip_, cfdi_use, email, avatar_url
        ):
            return create.execute(
                repo, schema_name, tax_id, legal_name, tax_regime, zip_, cfdi_use, email, avatar_url
            )
        case UpdateCustomerCommand(
            schema_name, customer_id, tax_id, legal_name, tax_regime, zip_, cfdi_use, email, avatar_url
        ):
            return update_.execute(
                repo, schema_name, customer_id, tax_id, legal_name, tax_regime, zip_, cfdi_use, email, avatar_url
            )
        case DeactivateCustomerCommand(schema_name, customer_id):
            return deactivate_.execute(repo, schema_name, customer_id)
        case ActivateCustomerCommand(schema_name, customer_id):
            return activate_.execute(repo, schema_name, customer_id)
        case DeleteCustomerCommand(schema_name, customer_id):
            return delete_.execute(repo, schema_name, customer_id)
        case ListCustomersQuery(schema_name, limit, offset):
            return list_.execute(repo, schema_name, limit, offset)
        case _:
            raise BusinessRuleViolation(f"Unknown customer command: {type(command).__name__}")
