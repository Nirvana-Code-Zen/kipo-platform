import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { Result } from '@/src/shared/domain/result'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const createExchangeCodeUseCase =
  (repo: IAuthRepository) =>
    (accessToken: string): Promise<Result<string, AuthError>> =>
      repo.createExchangeCode(accessToken)
