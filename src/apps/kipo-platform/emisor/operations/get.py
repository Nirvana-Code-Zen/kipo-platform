from emisor.repository import IEmisorRepository
from emisor.emisor import Emisor


def execute(repo: IEmisorRepository, schema_name: str) -> Emisor | None:
    return repo.find(schema_name)
