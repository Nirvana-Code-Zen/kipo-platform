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


@dataclass(frozen=True)
class UploadCsdCommand:
    schema_name: str
    cer_bytes: bytes
    key_bytes: bytes
    password: str


@dataclass(frozen=True)
class ConfirmManifiestoCommand:
    schema_name: str


@dataclass(frozen=True)
class UpdatePdfCustomizationCommand:
    schema_name: str
    custom_section_html: str | None
    display_options: dict


@dataclass(frozen=True)
class UpdateLogoCommand:
    schema_name: str
    logo_path: str | None
