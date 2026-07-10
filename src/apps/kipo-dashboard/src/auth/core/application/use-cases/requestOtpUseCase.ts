import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { RequestOtpDTO } from '../dtos'
import type { Result } from '@/src/shared/domain/result'
import type { OtpToken } from '../../domain/value-objects/AccessToken'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const requestOtpUseCase =
  (repo: IAuthRepository) =>
    (dto: RequestOtpDTO): Promise<Result<OtpToken, AuthError>> =>
      repo.requestOtp(dto.phone)
