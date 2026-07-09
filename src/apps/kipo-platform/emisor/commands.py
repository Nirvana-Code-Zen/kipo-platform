from dataclasses import dataclass


@dataclass(frozen=True)
class GetEmisorQuery:
    schema_name: str


@dataclass(frozen=True)
class UpsertEmisorCommand:
    schema_name: str
    rfc: str
    razon_social: str
    regimen_fiscal: str
    codigo_postal: str
    series: str | None
