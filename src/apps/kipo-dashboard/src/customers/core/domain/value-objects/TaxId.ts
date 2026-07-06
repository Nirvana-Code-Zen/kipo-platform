import { ok, err, type Result } from '@/src/shared/domain/result'

export type TaxIdType = 'natural' | 'legal' | 'general' | 'foreign'

export type TaxId = string & { readonly _brand: 'TaxId' }

export type TaxIdError =
  | { kind: 'TaxIdInvalid'; value: string }
  | { kind: 'TaxIdTooShort'; value: string }
  | { kind: 'TaxIdTooLong'; value: string }

export type TaxIdResult = { TaxId: TaxId; type: TaxIdType }

export const TaxId_GENERAL = 'XAXX010101000' as TaxId
export const TaxId_FOREIGN = 'XEXX010101000' as TaxId

const TaxId_LEGAL_RE = /^[A-ZÑ&]{3}\d{6}[A-Z\d]{3}$/
const TaxId_NATURAL_RE = /^[A-ZÑ&]{4}\d{6}[A-Z\d]{3}$/

export const createTaxId = (raw: string): Result<TaxIdResult, TaxIdError> => {
  const value = raw.trim().toUpperCase()

  if (value === TaxId_GENERAL) return ok({ TaxId: value as TaxId, type: 'general' })
  if (value === TaxId_FOREIGN) return ok({ TaxId: value as TaxId, type: 'foreign' })

  if (value.length < 12) return err({ kind: 'TaxIdTooShort', value })
  if (value.length > 13) return err({ kind: 'TaxIdTooLong', value })

  if (value.length === 12 && TaxId_LEGAL_RE.test(value)) return ok({ TaxId: value as TaxId, type: 'legal' })
  if (value.length === 13 && TaxId_NATURAL_RE.test(value)) return ok({ TaxId: value as TaxId, type: 'natural' })

  return err({ kind: 'TaxIdInvalid', value })
}
