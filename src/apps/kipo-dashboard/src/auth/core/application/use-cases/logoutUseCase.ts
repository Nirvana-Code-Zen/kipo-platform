import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { Result } from '@/src/shared/domain/result'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const logoutUseCase =
  (repo: IAuthRepository) =>
    (): Promise<Result<void, AuthError>> =>
      repo.logout()
