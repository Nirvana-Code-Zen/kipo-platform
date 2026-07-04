import { ok, err, type Result } from '@/src/shared/domain/result'

// Must match the Constancia de Situación Fiscal exactly — character for character
export type LegalName = string & { readonly _brand: 'LegalName' }
export type LegalNameError =
  | { kind: 'LegalNameEmpty' }
  | { kind: 'LegalNameTooLong'; maxLength: number }

const MAX_LENGTH = 254

export const createLegalName = (value: string): Result<LegalName, LegalNameError> => {
  // No trim — SAT validates including significant whitespace
  if (!value || value.length === 0) return err({ kind: 'LegalNameEmpty' })
  if (value.length > MAX_LENGTH) return err({ kind: 'LegalNameTooLong', maxLength: MAX_LENGTH })
  return ok(value as LegalName)
}
