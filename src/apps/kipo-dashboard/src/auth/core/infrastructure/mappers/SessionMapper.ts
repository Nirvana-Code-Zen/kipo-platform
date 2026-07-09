import { toAccessToken } from '../../domain/value-objects/AccessToken'

import type { Session, PersistedSession } from '../../domain/entities/Session'
import type { TenantSlug } from '../../domain/value-objects/TenantSlug'
import type { AuthProvider } from '../../domain/value-objects/AuthProvider'

export type SessionRaw = {
  user_id: string
  tenant_id: string | null
  tenant_slug: string | null
  tenant_name?: string
  display_name: string
  email?: string
  phone?: string
  avatar_url?: string
  provider: string
  access_token: string
  expires_at: string
}

export const SessionMapper = {
  toDomain (raw: SessionRaw): Session {
    return {
      userId: raw.user_id,
      tenantId: raw.tenant_id ?? null,
      tenantSlug: raw.tenant_slug ? raw.tenant_slug as TenantSlug : null,
      tenantName: raw.tenant_name ?? undefined,
      displayName: raw.display_name,
      email: raw.email,
      phone: raw.phone,
      avatarUrl: raw.avatar_url ?? undefined,
      provider: raw.provider as AuthProvider,
      accessToken: toAccessToken(raw.access_token),
      expiresAt: new Date(raw.expires_at),
    }
  },

  toPersistedDomain (raw: Omit<SessionRaw, 'access_token'>): PersistedSession {
    return {
      userId: raw.user_id,
      tenantId: raw.tenant_id,
      tenantSlug: raw.tenant_slug as TenantSlug,
      tenantName: raw.tenant_name ?? undefined,
      displayName: raw.display_name,
      email: raw.email,
      phone: raw.phone,
      avatarUrl: raw.avatar_url ?? undefined,
      provider: raw.provider as AuthProvider,
      expiresAt: new Date(raw.expires_at),
    }
  },
}
