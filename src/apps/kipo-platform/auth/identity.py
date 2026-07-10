from dataclasses import dataclass
from auth.value_objects.user_id import UserId
from auth.value_objects.email import Email
from auth.value_objects.phone_number import PhoneNumber
from auth.value_objects.auth_provider import AuthProvider


@dataclass(frozen=True)
class Identity:
    id: UserId
    email: Email | None
    phone: PhoneNumber | None
    provider: AuthProvider
    display_name: str | None = None
    avatar_url: str | None = None
