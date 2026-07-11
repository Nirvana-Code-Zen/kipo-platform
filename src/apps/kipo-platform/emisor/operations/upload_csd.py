from emisor.repository import IEmisorRepository
from emisor.emisor import Emisor
from emisor.pac_client import IPacClient
from shared.exceptions import NotFound


def execute(
    repo: IEmisorRepository,
    pac_client: IPacClient,
    schema_name: str,
    cer_bytes: bytes,
    key_bytes: bytes,
    password: str,
) -> Emisor:
    existing = repo.find(schema_name)
    if existing is None:
        raise NotFound("No fiscal data configured for this tenant yet")

    organization_id = existing.facturapi_organization_id or schema_name
    pac_client.upload_csd(organization_id, cer_bytes, key_bytes, password)

    return repo.update_csd(schema_name, organization_id)
