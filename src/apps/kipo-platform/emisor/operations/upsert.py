from emisor.repository import IEmisorRepository
from emisor.emisor import Emisor


def execute(
    repo: IEmisorRepository,
    schema_name: str,
    rfc: str,
    razon_social: str,
    regimen_fiscal: str,
    codigo_postal: str,
    series: str | None,
) -> Emisor:
    return repo.upsert(schema_name, rfc, razon_social, regimen_fiscal, codigo_postal, series)
