from abc import ABC, abstractmethod
from auth.identity import Identity
from auth.value_objects.email import Email
from auth.value_objects.phone_number import PhoneNumber
from auth.value_objects.auth_provider import AuthProvider


class IAuthRepository(ABC):

    @abstractmethod
    def sign_up_with_email(self, email: Email, password: str) -> Identity: ...

    @abstractmethod
    def sign_in_with_email(self, email: Email, password: str) -> dict: ...

    @abstractmethod
    def send_phone_otp(self, phone: PhoneNumber) -> None: ...

    @abstractmethod
    def verify_phone_otp(self, phone: PhoneNumber, token: str) -> dict: ...

    @abstractmethod
    def get_oauth_url(self, provider: AuthProvider, redirect_to: str) -> str: ...

    @abstractmethod
    def sign_out(self, access_token: str) -> None: ...

    @abstractmethod
    def refresh_session(self, refresh_token: str) -> dict: ...

    @abstractmethod
    def validate_oauth_session(self, access_token: str, refresh_token: str) -> dict: ...
