import { headers } from 'next/headers'

import { LoginView } from '@/src/auth/ui/views/LoginView'
import { getTenantSlugFromHost } from '@/src/shared/host/tenantSlug'
import { API_BASE_URL, APP_DOMAIN } from '@/src/shared/infrastructure/config'

const fetchTenantName = async (slug: string): Promise<string | undefined> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/tenants/by-slug/${slug}`, { cache: 'no-store' })
    if (!res.ok) return undefined
    const data = await res.json() as { name: string }
    return data.name
  } catch {
    return undefined
  }
}

export default async function LoginPage () {
  const host = (await headers()).get('host') ?? ''
  const slug = getTenantSlugFromHost(host.split(':')[0], APP_DOMAIN)
  const tenantName = slug ? await fetchTenantName(slug) : undefined

  return <LoginView tenantName={tenantName} />
}
