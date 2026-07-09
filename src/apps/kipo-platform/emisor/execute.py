from typing import Any
from emisor.commands import GetEmisorQuery, UpsertEmisorCommand
from emisor.operations import get, upsert
from shared.providers import get_emisor_repo
from shared.exceptions import BusinessRuleViolation


def execute(command: Any) -> Any:
    repo = get_emisor_repo()
    match command:
        case GetEmisorQuery(schema_name):
            return get.execute(repo, schema_name)
        case UpsertEmisorCommand(schema_name, rfc, razon_social, regimen_fiscal, codigo_postal, series):
            return upsert.execute(repo, schema_name, rfc, razon_social, regimen_fiscal, codigo_postal, series)
        case _:
            raise BusinessRuleViolation(f"Unknown emisor command: {type(command).__name__}")
