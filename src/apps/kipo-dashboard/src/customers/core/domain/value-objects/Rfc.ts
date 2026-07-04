import { ok, err, type Result } from '@/src/shared/domain/result'

export type RfcType = 'natural' | 'legal' | 'general' | 'foreign'

export type Rfc = string & { readonly _brand: 'Rfc' }

export type RfcError =
  | { kind: 'RfcInvalid'; value: string }
  | { kind: 'RfcTooShort'; value: string }
  | { kind: 'RfcTooLong'; value: string }

export type RfcResult = { rfc: Rfc; type: RfcType }

export const RFC_GENERAL = 'XAXX010101000' as Rfc
export const RFC_FOREIGN = 'XEXX010101000' as Rfc

const RFC_LEGAL_RE = /^[A-ZÑ&]{3}\d{6}[A-Z\d]{3}$/
const RFC_NATURAL_RE = /^[A-ZÑ&]{4}\d{6}[A-Z\d]{3}$/

export const createRfc = (raw: string): Result<RfcResult, RfcError> => {
  const value = raw.trim().toUpperCase()

  if (value === RFC_GENERAL) return ok({ rfc: value as Rfc, type: 'general' })
  if (value === RFC_FOREIGN) return ok({ rfc: value as Rfc, type: 'foreign' })

  if (value.length < 12) return err({ kind: 'RfcTooShort', value })
  if (value.length > 13) return err({ kind: 'RfcTooLong', value })

  if (value.length === 12 && RFC_LEGAL_RE.test(value)) return ok({ rfc: value as Rfc, type: 'legal' })
  if (value.length === 13 && RFC_NATURAL_RE.test(value)) return ok({ rfc: value as Rfc, type: 'natural' })

  return err({ kind: 'RfcInvalid', value })
}
