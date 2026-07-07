from shared import supabase
from shared.exceptions import BusinessRuleViolation
from auth import gateway


def with_email(email: str, password: str) -> dict:
    if not email or not password:
        raise BusinessRuleViolation("Email and password are required.")
    client = supabase.get_client()
    return gateway.sign_in_with_email(client, email, password)


def with_phone_otp(phone: str) -> None:
    if not phone:
        raise BusinessRuleViolation("Phone number is required.")
    client = supabase.get_client()
    gateway.send_phone_otp(client, phone)


def with_oauth(provider: str, redirect_to: str) -> str:
    if provider not in ("google", "facebook"):
        raise BusinessRuleViolation(f"Provider '{provider}' not supported.")
    client = supabase.get_client()
    return gateway.get_oauth_url(client, provider, redirect_to)
