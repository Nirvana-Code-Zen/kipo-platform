from dataclasses import dataclass


@dataclass(frozen=True)
class Emisor:
    id: str
    rfc: str
    razon_social: str
    regimen_fiscal: str
    codigo_postal: str
    series: str | None
    folio_siguiente: int
    created_at: str
    updated_at: str
