_SCHEMA_PREFIX = "tenant_"


def public_slug(schema_name: str) -> str:
    return schema_name.removeprefix(_SCHEMA_PREFIX)
