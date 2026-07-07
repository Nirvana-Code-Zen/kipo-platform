from auth.repository import IAuthRepository
from auth.identity import Identity
from auth.value_objects.email import Email
from auth.value_objects.password import Password


def with_email(repo: IAuthRepository, raw_email: str, raw_password: str) -> Identity:
    email = Email(raw_email or "")
    password = Password(raw_password or "")
    return repo.sign_up_with_email(email, password)
