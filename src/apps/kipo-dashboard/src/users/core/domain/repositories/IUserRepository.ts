import type { User } from '../entities/User'
import type { UserId } from '../value-objects/UserId'
import type { Rfc } from '../value-objects/Rfc'

export type IUserRepository = {
  findById: (id: UserId) => Promise<User | null>
  findByRfc: (rfc: Rfc) => Promise<User | null>
  findAll: () => Promise<User[]>
  save: (user: User) => Promise<void>
  delete: (id: UserId) => Promise<void>
}
