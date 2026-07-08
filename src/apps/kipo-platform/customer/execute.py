from typing import Any
from customer.commands import CreateCustomerCommand
from customer.operations import create
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
        case _:
            raise BusinessRuleViolation(f"Unknown customer command: {type(command).__name__}")
