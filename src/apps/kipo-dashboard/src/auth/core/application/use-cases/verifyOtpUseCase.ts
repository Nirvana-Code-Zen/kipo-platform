import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { VerifyOtpDTO } from '../dtos'
import type { Result } from '@/src/shared/domain/result'
import type { Session } from '../../domain/entities/Session'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const verifyOtpUseCase =
  (repo: IAuthRepository) =>
    (dto: VerifyOtpDTO): Promise<Result<Session, AuthError>> =>
      repo.verifyOtp(dto.otpToken, dto.code)
