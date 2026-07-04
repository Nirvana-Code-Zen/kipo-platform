import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { RegisterDTO } from '../dtos'
import type { Result } from '@/src/shared/domain/result'
import type { Session } from '../../domain/entities/Session'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const registerUseCase =
  (repo: IAuthRepository) =>
    (dto: RegisterDTO): Promise<Result<Session, AuthError>> =>
      repo.register(dto)
