from abc import ABC, abstractmethod


class IPacClient(ABC):
    """Port for the PAC (Proveedor Autorizado de Certificación) that stamps CFDI
    on the tenant's behalf. The emisor domain depends only on this contract —
    which PAC vendor implements it is an infrastructure concern."""

    @abstractmethod
    def upload_csd(
        self,
        organization_id: str,
        cer_bytes: bytes,
        key_bytes: bytes,
        password: str,
    ) -> bool: ...
