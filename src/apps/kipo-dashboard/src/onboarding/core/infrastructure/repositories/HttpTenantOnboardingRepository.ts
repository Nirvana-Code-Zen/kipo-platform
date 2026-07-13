import { ok, err } from '@/src/shared/domain/result'

import type { ITenantOnboardingRepository, TenantCreated, TenantOnboardingError } from '../../domain/repositories/ITenantOnboardingRepository'
import type { Result } from '@/src/shared/domain/result'

export const createHttpTenantOnboardingRepository = (baseUrl: string): ITenantOnboardingRepository => ({
  createTenant: async (data, accessToken): Promise<Result<TenantCreated, TenantOnboardingError>> => {
    try {
      const res = await fetch(`${baseUrl}/api/v1/tenants/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: data.name,
          schema_name: data.schemaName,
          timezone: data.timezone,
          currency: data.currency,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
        if (res.status === 400) return err({ kind: 'ValidationError', message: body.error ?? 'Datos inválidos' })
        return err({ kind: 'ServerError', status: res.status, message: body.error ?? res.statusText })
      }

      const raw = await res.json() as {
        tenant_id: string; name: string; schema_name: string; slug: string; timezone: string; currency: string
      }
      return ok({
        tenantId: raw.tenant_id,
        name: raw.name,
        schemaName: raw.schema_name,
        slug: raw.slug,
        timezone: raw.timezone,
        currency: raw.currency,
      })
    } catch (e) {
      return err({ kind: 'NetworkError', message: e instanceof Error ? e.message : 'Unknown error' })
    }
  },
})
