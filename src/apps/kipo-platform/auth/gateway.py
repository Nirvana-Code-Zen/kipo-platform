from supabase import Client
from auth.identity import Identity


def sign_up_with_email(client: Client, email: str, password: str) -> Identity:
    response = client.auth.sign_up({"email": email, "password": password})
    return _to_identity(response.user, "email")


def sign_in_with_email(client: Client, email: str, password: str) -> dict:
    response = client.auth.sign_in_with_password({"email": email, "password": password})
    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user": _to_identity(response.user, "email"),
    }


def send_phone_otp(client: Client, phone: str) -> None:
    client.auth.sign_in_with_otp({"phone": phone})


def verify_phone_otp(client: Client, phone: str, token: str) -> dict:
    response = client.auth.verify_otp({"phone": phone, "token": token, "type": "sms"})
    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user": _to_identity(response.user, "phone"),
    }


def get_oauth_url(client: Client, provider: str, redirect_to: str) -> str:
    response = client.auth.sign_in_with_oauth({
        "provider": provider,
        "options": {"redirect_to": redirect_to},
    })
    return response.url


def sign_out(client: Client, access_token: str) -> None:
    client.auth.admin.sign_out(access_token)


def _to_identity(user, provider: str) -> Identity:
    return Identity(
        id=str(user.id),
        email=user.email,
        phone=user.phone,
        provider=provider,
    )
