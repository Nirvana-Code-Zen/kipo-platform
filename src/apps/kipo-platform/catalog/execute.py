from typing import Any
from catalog.commands import (
    ListCartaPorteCatalogQuery,
    ListComercioExteriorCatalogQuery,
    ListCfdiCatalogQuery,
)
from catalog.operations import list_carta_porte, list_comercio_exterior, list_cfdi
from shared.providers import get_catalog_repo
from shared.exceptions import BusinessRuleViolation


def execute(command: Any) -> Any:
    repo = get_catalog_repo()
    match command:
        case ListCartaPorteCatalogQuery(catalog_type):
            return list_carta_porte.execute(repo, catalog_type)
        case ListComercioExteriorCatalogQuery(catalog_type):
            return list_comercio_exterior.execute(repo, catalog_type)
        case ListCfdiCatalogQuery(catalog_type):
            return list_cfdi.execute(repo, catalog_type)
        case _:
            raise BusinessRuleViolation(f"Unknown catalog command: {type(command).__name__}")
