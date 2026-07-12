from catalog.repository import ICatalogRepository
from catalog.catalog_types import CFDI_CATALOGS
from shared.exceptions import BusinessRuleViolation


def execute(repo: ICatalogRepository, catalog_type: str) -> list[dict]:
    table_name = CFDI_CATALOGS.get(catalog_type)
    if table_name is None:
        valid = ", ".join(sorted(CFDI_CATALOGS))
        raise BusinessRuleViolation(
            f"'{catalog_type}' no es un catálogo de CFDI/Nómina válido. Valores permitidos: {valid}."
        )
    return repo.find_by_table(table_name)
