import os
from supabase import create_client, Client

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        url = os.environ.get("PROJECT_URL", "")
        key = os.environ.get("AUTH_KEY_PUBLISHABLE", "")
        _client = create_client(url, key)
    return _client
