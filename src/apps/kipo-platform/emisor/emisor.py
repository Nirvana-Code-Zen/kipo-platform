from dataclasses import dataclass, field


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
    facturapi_organization_id: str | None = None
    csd_configured: bool = False
    csd_configured_at: str | None = None
    manifiesto_signed: bool = False
    manifiesto_signed_at: str | None = None
    custom_section_html: str | None = None
    display_options: dict = field(default_factory=dict)
    logo_path: str | None = None
