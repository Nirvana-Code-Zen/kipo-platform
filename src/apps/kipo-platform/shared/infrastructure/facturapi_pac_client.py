from emisor.pac_client import IPacClient


class FakeFacturapiPacClient(IPacClient):
    """Stub adapter — no real HTTP calls to FacturAPI yet.

    Swap the body of `upload_csd` for a real call to
    `PUT /organizations/{organization_id}/certificates` once Kipo has
    FacturAPI API credentials. No other file needs to change — this is
    the only place FacturAPI is named."""

    def upload_csd(
        self,
        organization_id: str,
        cer_bytes: bytes,
        key_bytes: bytes,
        password: str,
    ) -> bool:
        return bool(cer_bytes and key_bytes and password)

    def upload_logo(
        self,
        organization_id: str,
        image_bytes: bytes,
        content_type: str,
    ) -> bool:
        return bool(image_bytes and content_type)
