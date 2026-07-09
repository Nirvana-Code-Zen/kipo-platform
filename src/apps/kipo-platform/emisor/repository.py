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
