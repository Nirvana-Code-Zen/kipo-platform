import { ok, err, type Result } from '@/src/shared/domain/result'

export type TaxRegime = string & { readonly _brand: 'TaxRegime' }

export const GENERIC_TAX_REGIME = '616' as TaxRegime

export type TaxRegimeError = { kind: 'TaxRegimeInvalid'; value: string }

const TAX_REGIME_RE = /^\d{3}$/

export const createTaxRegime = (value: string): Result<TaxRegime, TaxRegimeError> => {
  if (!TAX_REGIME_RE.test(value.trim())) return err({ kind: 'TaxRegimeInvalid', value })
  return ok(value.trim() as TaxRegime)
}
