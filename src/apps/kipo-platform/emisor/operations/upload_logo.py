from emisor.repository import IEmisorRepository
from emisor.emisor import Emisor
from shared.exceptions import NotFound


def execute(repo: IEmisorRepository, schema_name: str, logo_path: str | None) -> Emisor:
    existing = repo.find(schema_name)
    if existing is None:
        raise NotFound("No fiscal data configured for this tenant yet")
    return repo.update_logo(schema_name, logo_path)
