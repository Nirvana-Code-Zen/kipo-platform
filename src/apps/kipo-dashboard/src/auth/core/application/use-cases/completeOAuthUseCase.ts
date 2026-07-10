import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { OAuthCallbackDTO } from '../dtos'
import type { Result } from '@/src/shared/domain/result'
import type { Session } from '../../domain/entities/Session'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const completeOAuthUseCase =
  (repo: IAuthRepository) =>
    (dto: OAuthCallbackDTO): Promise<Result<Session, AuthError>> =>
      repo.completeOAuth(dto.accessToken, dto.refreshToken)
