import { getTenantSlugFromHost, buildTenantUrl } from '@/src/shared/host/tenantSlug'
import { APP_DOMAIN } from '@/src/shared/infrastructure/config'

import { useAuthStore } from '../store/authStore'

export const SSO_PARAM = 'sso'

export const goToTenantPath = async (
  replace: (href: string) => void,
  slug: string | null | undefined,
  path: string
): Promise<void> => {
  if (!slug || typeof window === 'undefined') { replace(path); return }

  const currentSlug = getTenantSlugFromHost(window.location.hostname, APP_DOMAIN)
  if (currentSlug === slug) { replace(path); return }

  const code = await useAuthStore.getState().mintExchangeCode()
  const url = buildTenantUrl(slug, APP_DOMAIN, path)
  window.location.href = code ? `${url}?${SSO_PARAM}=${encodeURIComponent(code)}` : url
}
