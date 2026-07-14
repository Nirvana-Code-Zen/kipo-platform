from datetime import datetime, timezone
import jwt
from supabase import Client
from supabase_auth.errors import AuthApiError
from auth.repository import IAuthRepository
from auth.identity import Identity
from auth.value_objects.user_id import UserId
from auth.value_objects.email import Email
from auth.value_objects.phone_number import PhoneNumber
from auth.value_objects.auth_provider import AuthProvider
from shared.exceptions import BusinessRuleViolation


def _guard(fn):
    """Convert Supabase AuthApiError into BusinessRuleViolation so endpoints catch it."""
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except AuthApiError as e:
            raise BusinessRuleViolation(str(e)) from e
    return wrapper


class SupabaseAuthRepository(IAuthRepository):

    def __init__(self, client: Client) -> None:
        self._client = client

    @_guard
    def sign_up_with_email(self, email: Email, password: str) -> Identity:
        response = self._client.auth.sign_up({"email": str(email), "password": password})
        return self._to_identity(response.user, AuthProvider("email"))

    @_guard
    def sign_in_with_email(self, email: Email, password: str) -> dict:
        response = self._client.auth.sign_in_with_password(
            {"email": str(email), "password": password}
        )
        expires_at = datetime.fromtimestamp(
            response.session.expires_at, tz=timezone.utc
        ).isoformat()
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_at": expires_at,
            "user": self._to_identity(response.user, AuthProvider("email")),
        }

    @_guard
    def send_phone_otp(self, phone: PhoneNumber) -> None:
        self._client.auth.sign_in_with_otp({"phone": str(phone)})

    @_guard
    def verify_phone_otp(self, phone: PhoneNumber, token: str) -> dict:
        response = self._client.auth.verify_otp(
            {"phone": str(phone), "token": token, "type": "sms"}
        )
        expires_at = datetime.fromtimestamp(
            response.session.expires_at, tz=timezone.utc
        ).isoformat()
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_at": expires_at,
            "user": self._to_identity(response.user, AuthProvider("phone")),
        }

    def get_oauth_url(self, provider: AuthProvider, redirect_to: str) -> str:
        response = self._client.auth.sign_in_with_oauth({
            "provider": str(provider),
            "options": {"redirect_to": redirect_to},
        })
        return response.url

    @_guard
    def validate_oauth_session(self, access_token: str, refresh_token: str) -> dict:
        user_resp = self._client.auth.get_user(access_token)
        user = user_resp.user
        provider = user.app_metadata.get("provider", "email")
        payload = jwt.decode(access_token, options={"verify_signature": False})
        expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc).isoformat()
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_at": expires_at,
            "user": self._to_identity(user, AuthProvider(provider)),
        }

    def sign_out(self, access_token: str) -> None:
        if not access_token:
            return
        try:
            self._client.auth.admin.sign_out(access_token, scope="global")
        except Exception:
            pass

    @_guard
    def refresh_session(self, refresh_token: str) -> dict:
        response = self._client.auth.refresh_session(refresh_token)
        expires_at = datetime.fromtimestamp(
            response.session.expires_at, tz=timezone.utc
        ).isoformat()
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_at": expires_at,
            "user": self._to_identity(response.user, AuthProvider(
                response.user.app_metadata.get("provider", "email")
            )),
        }

    def _to_identity(self, user, provider: AuthProvider) -> Identity:
        metadata = (user.user_metadata or {}) if user.user_metadata else {}
        return Identity(
            id=UserId(str(user.id)),
            email=Email(user.email) if user.email else None,
            phone=PhoneNumber(user.phone) if user.phone else None,
            provider=provider,
            display_name=metadata.get("display_name"),
            avatar_url=metadata.get("avatar_url"),
        )
