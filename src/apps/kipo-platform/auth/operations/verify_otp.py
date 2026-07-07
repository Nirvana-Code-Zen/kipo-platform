from shared import supabase
from shared.exceptions import BusinessRuleViolation
from auth import gateway


def execute(phone: str, token: str) -> dict:
    if not phone or not token:
        raise BusinessRuleViolation("Phone and OTP token are required.")
    client = supabase.get_client()
    return gateway.verify_phone_otp(client, phone, token)
