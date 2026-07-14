from auth.repository import IAuthRepository
from auth.infrastructure.exchange_code_repository import ExchangeCodeRepository
from shared.exceptions import BusinessRuleViolation


def create_code(exchange_repo: ExchangeCodeRepository, refresh_token: str, user_id: str) -> str:
    return exchange_repo.create(refresh_token, user_id)


def consume_code(repo: IAuthRepository, exchange_repo: ExchangeCodeRepository, code: str) -> dict:
    refresh_token = exchange_repo.consume(code)
    if not refresh_token:
        raise BusinessRuleViolation("Invalid or expired exchange code")
    return repo.refresh_session(refresh_token)
