from catalog.repository import ICatalogRepository
from catalog.catalog_types import CARTA_PORTE_CATALOGS
from shared.exceptions import BusinessRuleViolation


def execute(repo: ICatalogRepository, catalog_type: str) -> list[dict]:
    table_name = CARTA_PORTE_CATALOGS.get(catalog_type)
    if table_name is None:
        valid = ", ".join(sorted(CARTA_PORTE_CATALOGS))
        raise BusinessRuleViolation(
            f"'{catalog_type}' no es un catálogo de Carta Porte válido. Valores permitidos: {valid}."
        )
    return repo.find_by_table(table_name)
