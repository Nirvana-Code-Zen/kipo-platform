import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { LoginWithSocialDTO } from '../dtos'
import type { Result } from '@/src/shared/domain/result'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const loginWithSocialUseCase =
  (repo: IAuthRepository) =>
    (dto: LoginWithSocialDTO): Promise<Result<string, AuthError>> =>
      repo.loginWithSocial(dto.provider, dto.redirectTo)
