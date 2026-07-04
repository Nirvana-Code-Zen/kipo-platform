import { UserMapper, type UserRaw } from '../mappers/UserMapper'

import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import type { User } from '../../domain/entities/User'
import type { UserId } from '../../domain/value-objects/UserId'
import type { Rfc } from '../../domain/value-objects/Rfc'

export const createHttpUserRepository = (baseUrl: string): IUserRepository => {
  const url = `${baseUrl}/users`

  const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${url}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return res.json() as Promise<T>
  }

  return {
    findById: async (id: UserId) => {
      try {
        return UserMapper.toDomain(await request<UserRaw>(`/${id}`))
      } catch { return null }
    },

    findByRfc: async (rfc: Rfc) => {
      try {
        const data = await request<UserRaw[]>(`?rfc=${encodeURIComponent(rfc)}`)
        return data.length ? UserMapper.toDomain(data[0]) : null
      } catch { return null }
    },

    findAll: async () => {
      const data = await request<UserRaw[]>('')
      return data.map(UserMapper.toDomain)
    },

    save: async (user: User) => {
      await request('', { method: 'POST', body: JSON.stringify(UserMapper.toPersistence(user)) })
    },

    delete: async (id: UserId) => {
      await request(`/${id}`, { method: 'DELETE' })
    },
  }
}
