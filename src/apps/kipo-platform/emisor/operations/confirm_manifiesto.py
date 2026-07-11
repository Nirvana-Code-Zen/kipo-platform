from emisor.repository import IEmisorRepository
from emisor.emisor import Emisor
from shared.exceptions import NotFound


def execute(repo: IEmisorRepository, schema_name: str) -> Emisor:
    existing = repo.find(schema_name)
    if existing is None:
        raise NotFound("No fiscal data configured for this tenant yet")
    return repo.update_manifiesto(schema_name)
