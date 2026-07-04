import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { LoginWithEmailDTO } from '../dtos'
import type { Result } from '@/src/shared/domain/result'
import type { Session } from '../../domain/entities/Session'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const loginWithEmailUseCase =
  (repo: IAuthRepository) =>
    (dto: LoginWithEmailDTO): Promise<Result<Session, AuthError>> =>
      repo.loginWithEmail(dto.email, dto.password)
