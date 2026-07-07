from dataclasses import dataclass


@dataclass(frozen=True)
class SignUpWithEmailCommand:
    email: str
    password: str


@dataclass(frozen=True)
class SignInWithEmailCommand:
    email: str
    password: str


@dataclass(frozen=True)
class SignInWithPhoneCommand:
    phone: str


@dataclass(frozen=True)
class VerifyPhoneOtpCommand:
    phone: str
    token: str


@dataclass(frozen=True)
class SignInWithOAuthCommand:
    provider: str
    redirect_to: str


@dataclass(frozen=True)
class SignOutCommand:
    access_token: str
