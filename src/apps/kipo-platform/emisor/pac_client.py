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

    @abstractmethod
    def upload_logo(
        self,
        organization_id: str,
        image_bytes: bytes,
        content_type: str,
    ) -> bool:
        """Unused for now — the live upload flow only persists the logo to our
        own Supabase Storage bucket and `emisor.logo_path`. This is an isolated
        point of integration for when real FacturAPI credentials exist."""
        ...
