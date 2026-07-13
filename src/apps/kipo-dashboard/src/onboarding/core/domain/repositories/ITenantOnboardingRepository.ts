import type { Result } from '@/src/shared/domain/result'

export type TenantCreated = {
  tenantId: string
  name: string
  schemaName: string
  slug: string
  timezone: string
  currency: string
}

export type TenantOnboardingError =
  | { kind: 'ValidationError'; message: string }
  | { kind: 'NetworkError'; message: string }
  | { kind: 'ServerError'; status: number; message: string }

export type ITenantOnboardingRepository = {
  createTenant: (data: {
    name: string
    schemaName: string
    timezone: string
    currency: string
  }, accessToken: string) => Promise<Result<TenantCreated, TenantOnboardingError>>
}
