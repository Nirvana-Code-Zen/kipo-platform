from abc import ABC, abstractmethod


class IStampPackRepository(ABC):

    @abstractmethod
    def has_processed(self, stripe_checkout_session_id: str) -> bool: ...

    @abstractmethod
    def record_purchase(
        self,
        tenant_id: str,
        pack_id: str,
        qty: int,
        amount_cents: int,
        stripe_checkout_session_id: str,
    ) -> None: ...

    @abstractmethod
    def credit_stamps(self, tenant_id: str, qty: int) -> None: ...
