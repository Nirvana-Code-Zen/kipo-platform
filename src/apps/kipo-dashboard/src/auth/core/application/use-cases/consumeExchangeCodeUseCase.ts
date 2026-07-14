import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { Result } from '@/src/shared/domain/result'
import type { Session } from '../../domain/entities/Session'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const consumeExchangeCodeUseCase =
  (repo: IAuthRepository) =>
    (code: string): Promise<Result<Session, AuthError>> =>
      repo.consumeExchangeCode(code)
