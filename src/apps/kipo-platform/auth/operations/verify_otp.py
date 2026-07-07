from auth.repository import IAuthRepository
from auth.value_objects.phone_number import PhoneNumber
from shared.exceptions import BusinessRuleViolation


def execute(repo: IAuthRepository, raw_phone: str, token: str) -> dict:
    phone = PhoneNumber(raw_phone or "")
    if not token or not token.strip():
        raise BusinessRuleViolation("OTP token is required.")
    return repo.verify_phone_otp(phone, token.strip())
