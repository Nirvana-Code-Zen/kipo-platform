import type { CreateTenantDTO } from '../dtos/CreateTenantDTO'
import type { ITenantOnboardingRepository, TenantCreated, TenantOnboardingError } from '../../domain/repositories/ITenantOnboardingRepository'
import type { Result } from '@/src/shared/domain/result'

export const createTenantUseCase =
  (repo: ITenantOnboardingRepository) =>
    (dto: CreateTenantDTO, accessToken: string): Promise<Result<TenantCreated, TenantOnboardingError>> =>
      repo.createTenant({
        name: dto.name,
        schemaName: dto.schemaName,
        timezone: dto.timezone,
        currency: dto.currency,
      }, accessToken)
