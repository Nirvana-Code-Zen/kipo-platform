from abc import ABC, abstractmethod


class ICatalogRepository(ABC):

    @abstractmethod
    def find_by_table(self, table_name: str) -> list[dict]: ...
