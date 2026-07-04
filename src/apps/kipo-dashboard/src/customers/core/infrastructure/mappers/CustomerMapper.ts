import type { Customer } from '../../domain/entities/Customer'

export type CustomerRaw = {
  id: string
  user_id: string
  type: 'natural' | 'legal' | 'general' | 'foreign'
  rfc: string
  legal_name: string
  tax_regime: string
  zip_code: string
  cfdi_usage: string
  created_at: string
  updated_at: string
}

export const CustomerMapper = {
  toDomain: (raw: CustomerRaw): Customer => ({
    id: raw.id as never,
    userId: raw.user_id as never,
    type: raw.type,
    rfc: raw.rfc as never,
    legalName: raw.legal_name as never,
    taxRegime: raw.tax_regime as never,
    zipCode: raw.zip_code as never,
    cfdiUsage: raw.cfdi_usage as never,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  }),

  toPersistence: (c: Customer): CustomerRaw => ({
    id: c.id,
    user_id: c.userId,
    type: c.type,
    rfc: c.rfc,
    legal_name: c.legalName,
    tax_regime: c.taxRegime,
    zip_code: c.zipCode,
    cfdi_usage: c.cfdiUsage,
    created_at: c.createdAt.toISOString(),
    updated_at: c.updatedAt.toISOString(),
  }),
}
