from typing import Any
from auth.commands import (
    SignUpWithEmailCommand,
    SignInWithEmailCommand,
    SignInWithPhoneCommand,
    VerifyPhoneOtpCommand,
    SignInWithOAuthCommand,
    SignOutCommand,
    RefreshSessionCommand,
)
from auth.operations import sign_up, sign_in, verify_otp, sign_out
from shared.exceptions import BusinessRuleViolation
from shared.providers import get_auth_repo


def execute(command: Any) -> Any:
    repo = get_auth_repo()
    match command:
        case SignUpWithEmailCommand(email, password):
            return sign_up.with_email(repo, email, password)
        case SignInWithEmailCommand(email, password):
            return sign_in.with_email(repo, email, password)
        case SignInWithPhoneCommand(phone):
            return sign_in.with_phone_otp(repo, phone)
        case VerifyPhoneOtpCommand(phone, token):
            return verify_otp.execute(repo, phone, token)
        case SignInWithOAuthCommand(provider, redirect_to):
            return sign_in.with_oauth(repo, provider, redirect_to)
        case SignOutCommand(access_token):
            return sign_out.execute(repo, access_token)
        case RefreshSessionCommand(refresh_token):
            return repo.refresh_session(refresh_token)
        case _:
            raise BusinessRuleViolation(
                f"Unknown auth command: {type(command).__name__}"
            )
