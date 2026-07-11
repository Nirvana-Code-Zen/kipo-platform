from typing import Any
from emisor.commands import GetEmisorQuery, UpsertEmisorCommand, UploadCsdCommand, ConfirmManifiestoCommand
from emisor.operations import get, upsert, upload_csd, confirm_manifiesto
from shared.providers import get_emisor_repo, get_pac_client
from shared.exceptions import BusinessRuleViolation


def execute(command: Any) -> Any:
    repo = get_emisor_repo()
    match command:
        case GetEmisorQuery(schema_name):
            return get.execute(repo, schema_name)
        case UpsertEmisorCommand(schema_name, rfc, razon_social, regimen_fiscal, codigo_postal, series):
            return upsert.execute(repo, schema_name, rfc, razon_social, regimen_fiscal, codigo_postal, series)
        case UploadCsdCommand(schema_name, cer_bytes, key_bytes, password):
            return upload_csd.execute(repo, get_pac_client(), schema_name, cer_bytes, key_bytes, password)
        case ConfirmManifiestoCommand(schema_name):
            return confirm_manifiesto.execute(repo, schema_name)
        case _:
            raise BusinessRuleViolation(f"Unknown emisor command: {type(command).__name__}")
