import { ok, err, type Result } from '@/src/shared/domain/result'

// URL-safe identifier that scopes all tenant operations across bounded contexts
export type TenantSlug = string & { readonly _brand: 'TenantSlug' }

export type TenantSlugError = { kind: 'TenantSlugInvalid'; value: string }

// lowercase letters, numbers, hyphens — no leading/trailing hyphens
const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/

export const createTenantSlug = (value: string): Result<TenantSlug, TenantSlugError> => {
  const trimmed = value.trim().toLowerCase()
  if (!SLUG_RE.test(trimmed)) return err({ kind: 'TenantSlugInvalid', value })
  return ok(trimmed as TenantSlug)
}
