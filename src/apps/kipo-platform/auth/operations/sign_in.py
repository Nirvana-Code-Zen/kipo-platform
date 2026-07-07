from auth.repository import IAuthRepository
from auth.value_objects.email import Email
from auth.value_objects.password import Password
from auth.value_objects.phone_number import PhoneNumber
from auth.value_objects.auth_provider import AuthProvider


def with_email(repo: IAuthRepository, raw_email: str, raw_password: str) -> dict:
    email = Email(raw_email or "")
    password = Password(raw_password or "")
    return repo.sign_in_with_email(email, password)


def with_phone_otp(repo: IAuthRepository, raw_phone: str) -> None:
    phone = PhoneNumber(raw_phone or "")
    repo.send_phone_otp(phone)


def with_oauth(repo: IAuthRepository, raw_provider: str, redirect_to: str) -> str:
    provider = AuthProvider(raw_provider or "")
    return repo.get_oauth_url(provider, redirect_to)
