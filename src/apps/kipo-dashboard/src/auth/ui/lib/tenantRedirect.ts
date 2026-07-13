import { getTenantSlugFromHost, buildTenantUrl } from '@/src/shared/host/tenantSlug'
import { APP_DOMAIN } from '@/src/shared/infrastructure/config'

// Navigates to `path` on the tenant's own subdomain when one is known and
// we're not already there (full page load, since it crosses hosts); falls
// back to a same-origin client navigation otherwise.
export const goToTenantPath = (
  replace: (href: string) => void,
  slug: string | null | undefined,
  path: string
) => {
  if (!slug || typeof window === 'undefined') { replace(path); return }

  const currentSlug = getTenantSlugFromHost(window.location.hostname, APP_DOMAIN)
  if (currentSlug === slug) { replace(path); return }

  window.location.href = buildTenantUrl(slug, APP_DOMAIN, path)
}
