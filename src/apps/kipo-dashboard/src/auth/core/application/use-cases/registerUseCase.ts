import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { RegisterDTO } from '../dtos'
import type { Result } from '@/src/shared/domain/result'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const registerUseCase =
  (repo: IAuthRepository) =>
    (dto: RegisterDTO): Promise<Result<{ emailPending: true; email: string | null }, AuthError>> =>
      repo.register(dto)
