from shared import supabase
from auth import gateway


def execute(access_token: str) -> None:
    client = supabase.get_client()
    gateway.sign_out(client, access_token)
