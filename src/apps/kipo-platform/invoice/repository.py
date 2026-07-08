from abc import ABC, abstractmethod
from invoice.invoice import Invoice


class IInvoiceRepository(ABC):

    @abstractmethod
    def save(self, invoice: Invoice, schema_name: str) -> Invoice: ...

    @abstractmethod
    def find_all(self, schema_name: str, limit: int, offset: int) -> list[Invoice]: ...

    @abstractmethod
    def find_by_id(self, invoice_id: str, schema_name: str) -> Invoice: ...

    @abstractmethod
    def cancel(self, invoice_id: str, schema_name: str) -> None: ...

    @abstractmethod
    def delete(self, invoice_id: str, schema_name: str) -> None: ...

    @abstractmethod
    def count_by_status(self, schema_name: str, status: str) -> int: ...

    @abstractmethod
    def get_dashboard_stats(self, schema_name: str) -> dict: ...

    @abstractmethod
    def get_billing_activity(self, schema_name: str, view: str, week_start: str | None) -> list[dict]: ...
