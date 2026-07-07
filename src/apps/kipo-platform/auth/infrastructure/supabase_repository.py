from supabase import Client
from auth.repository import IAuthRepository
from auth.identity import Identity
from auth.value_objects.user_id import UserId
from auth.value_objects.email import Email
from auth.value_objects.phone_number import PhoneNumber
from auth.value_objects.auth_provider import AuthProvider


class SupabaseAuthRepository(IAuthRepository):

    def __init__(self, client: Client) -> None:
        self._client = client

    def sign_up_with_email(self, email: Email, password: str) -> Identity:
        response = self._client.auth.sign_up({"email": str(email), "password": password})
        return self._to_identity(response.user, AuthProvider("email"))

    def sign_in_with_email(self, email: Email, password: str) -> dict:
        response = self._client.auth.sign_in_with_password(
            {"email": str(email), "password": password}
        )
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": self._to_identity(response.user, AuthProvider("email")),
        }

    def send_phone_otp(self, phone: PhoneNumber) -> None:
        self._client.auth.sign_in_with_otp({"phone": str(phone)})

    def verify_phone_otp(self, phone: PhoneNumber, token: str) -> dict:
        response = self._client.auth.verify_otp(
            {"phone": str(phone), "token": token, "type": "sms"}
        )
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": self._to_identity(response.user, AuthProvider("phone")),
        }

    def get_oauth_url(self, provider: AuthProvider, redirect_to: str) -> str:
        response = self._client.auth.sign_in_with_oauth({
            "provider": str(provider),
            "options": {"redirect_to": redirect_to},
        })
        return response.url

    def sign_out(self, access_token: str) -> None:
        self._client.auth.admin.sign_out(access_token)

    def _to_identity(self, user, provider: AuthProvider) -> Identity:
        return Identity(
            id=UserId(str(user.id)),
            email=Email(user.email) if user.email else None,
            phone=PhoneNumber(user.phone) if user.phone else None,
            provider=provider,
        )
