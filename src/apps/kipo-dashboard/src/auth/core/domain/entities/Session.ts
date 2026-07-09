import type { TenantSlug } from '../value-objects/TenantSlug'
import type { AccessToken } from '../value-objects/AccessToken'
import type { AuthProvider } from '../value-objects/AuthProvider'

export type Session = Readonly<{
  userId: string
  tenantId: string | null   // null until onboarding completes
  tenantSlug: TenantSlug | null
  tenantName?: string
  displayName: string
  email?: string
  phone?: string
  avatarUrl?: string
  provider: AuthProvider
  accessToken: AccessToken  // in-memory only, excluded from localStorage persistence
  expiresAt: Date
}>

// Stored in localStorage — public session data without the access token
export type PersistedSession = Omit<Session, 'accessToken'>

export const isExpired = (session: Session): boolean =>
  session.expiresAt.getTime() < Date.now()

export const getAuthHeader = (session: Session): Record<string, string> => ({
  Authorization: `Bearer ${session.accessToken}`,
})

export const toPersistedSession = (session: Session): PersistedSession => {
  const { accessToken: _accessToken, ...rest } = session
  return rest
}

export const hydrateSession = (
  persisted: PersistedSession,
  accessToken: AccessToken
): Session => ({ ...persisted, accessToken })
