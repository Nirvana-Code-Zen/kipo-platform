import type { User } from '../../domain/entities/User'

export type UserRaw = {
  id: string
  type: 'natural' | 'legal' | 'foreign'
  rfc: string
  legal_name: string
  tax_regime: string
  zip_code: string
  created_at: string
  updated_at: string
}

export const UserMapper = {
  toDomain: (raw: UserRaw): User => ({
    id: raw.id as never,
    type: raw.type,
    rfc: raw.rfc as never,
    legalName: raw.legal_name as never,
    taxRegime: raw.tax_regime as never,
    zipCode: raw.zip_code as never,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  }),

  toPersistence: (user: User): UserRaw => ({
    id: user.id,
    type: user.type,
    rfc: user.rfc,
    legal_name: user.legalName,
    tax_regime: user.taxRegime,
    zip_code: user.zipCode,
    created_at: user.createdAt.toISOString(),
    updated_at: user.updatedAt.toISOString(),
  }),
}
