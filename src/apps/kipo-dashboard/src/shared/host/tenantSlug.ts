const RESERVED_LABELS = new Set(['app', 'www'])

export const getTenantSlugFromHost = (hostname: string, appDomain: string): string | null => {
  if (!appDomain || hostname === appDomain) return null
  if (!hostname.endsWith(`.${appDomain}`)) return null

  const label = hostname.slice(0, -(appDomain.length + 1))
  if (label.includes('.') || RESERVED_LABELS.has(label)) return null

  return label
}

export const buildTenantUrl = (slug: string, appDomain: string, path: string): string => {
  const { protocol, port } = window.location
  return `${protocol}//${slug}.${appDomain}${port ? `:${port}` : ''}${path}`
}
