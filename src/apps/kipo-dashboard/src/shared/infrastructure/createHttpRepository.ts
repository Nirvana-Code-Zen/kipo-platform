type Mapper<TDomain, TPersistence> = {
  toDomain: (raw: TPersistence) => TDomain
  toPersistence: (domain: TDomain) => TPersistence
}

type HttpRepositoryConfig<TDomain, TPersistence> = {
  baseUrl: string
  mapper: Mapper<TDomain, TPersistence>
  getId: (domain: TDomain) => string
  headers?: Record<string, string>
}

export type HttpRepository<TDomain> = {
  findById: (id: string) => Promise<TDomain | null>
  findAll: () => Promise<TDomain[]>
  create: (entity: TDomain) => Promise<void>
  save: (entity: TDomain) => Promise<void>
  delete: (id: string) => Promise<void>
}

const BASE_HEADERS = { 'Content-Type': 'application/json' }

const safeFetch = async (
  url: string,
  options?: RequestInit,
  extraHeaders?: Record<string, string>
): Promise<Response> => {
  const res = await fetch(url, {
    ...options,
    headers: { ...BASE_HEADERS, ...extraHeaders, ...options?.headers },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText} — ${url}`)
  return res
}

export const createHttpRepository = <TDomain, TPersistence>(
  config: HttpRepositoryConfig<TDomain, TPersistence>
): HttpRepository<TDomain> => ({
    findById: async (id) => {
      const res = await fetch(`${config.baseUrl}/${id}`, {
        headers: { ...BASE_HEADERS, ...config.headers },
      })
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      return config.mapper.toDomain((await res.json()) as TPersistence)
    },

    findAll: async () => {
      const res = await safeFetch(config.baseUrl, undefined, config.headers)
      return ((await res.json()) as TPersistence[]).map(config.mapper.toDomain)
    },

    create: async (entity) => {
      await safeFetch(
        config.baseUrl,
        { method: 'POST', body: JSON.stringify(config.mapper.toPersistence(entity)) },
        config.headers
      )
    },

    save: async (entity) => {
      await safeFetch(
      `${config.baseUrl}/${config.getId(entity)}`,
      { method: 'PUT', body: JSON.stringify(config.mapper.toPersistence(entity)) },
      config.headers
      )
    },

    delete: async (id) => {
      await safeFetch(`${config.baseUrl}/${id}`, { method: 'DELETE' }, config.headers)
    },
  })
