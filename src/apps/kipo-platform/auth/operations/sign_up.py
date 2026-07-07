from shared import supabase
from shared.exceptions import BusinessRuleViolation
from auth import gateway
from auth.identity import Identity


def with_email(email: str, password: str) -> Identity:
    if not email or not password:
        raise BusinessRuleViolation("Email and password are required.")
    client = supabase.get_client()
    return gateway.sign_up_with_email(client, email, password)
