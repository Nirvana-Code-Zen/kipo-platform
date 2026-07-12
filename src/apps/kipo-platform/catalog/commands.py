from dataclasses import dataclass


@dataclass(frozen=True)
class ListCartaPorteCatalogQuery:
    catalog_type: str


@dataclass(frozen=True)
class ListComercioExteriorCatalogQuery:
    catalog_type: str


@dataclass(frozen=True)
class ListCfdiCatalogQuery:
    catalog_type: str
