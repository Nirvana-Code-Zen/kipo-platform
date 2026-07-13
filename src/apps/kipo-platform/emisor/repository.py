from abc import ABC, abstractmethod
from emisor.emisor import Emisor


class IEmisorRepository(ABC):

    @abstractmethod
    def find(self, schema_name: str) -> Emisor | None: ...

    @abstractmethod
    def upsert(
        self,
        schema_name: str,
        rfc: str,
        razon_social: str,
        regimen_fiscal: str,
        codigo_postal: str,
        series: str | None,
    ) -> Emisor: ...

    @abstractmethod
    def next_folio(self, schema_name: str) -> tuple[int, str | None]: ...

    @abstractmethod
    def update_csd(self, schema_name: str, organization_id: str | None) -> Emisor: ...

    @abstractmethod
    def update_manifiesto(self, schema_name: str) -> Emisor: ...

    @abstractmethod
    def update_pdf_customization(
        self, schema_name: str, custom_section_html: str | None, display_options: dict
    ) -> Emisor: ...

    @abstractmethod
    def update_logo(self, schema_name: str, logo_path: str | None) -> Emisor: ...
