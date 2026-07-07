from auth.repository import IAuthRepository


def execute(repo: IAuthRepository, access_token: str) -> None:
    repo.sign_out(access_token)
