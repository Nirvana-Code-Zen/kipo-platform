import { ok, err, type Result } from '@/src/shared/domain/result'

export type ZipCode = string & { readonly _brand: 'ZipCode' }

export type ZipCodeError = { kind: 'ZipCodeInvalid'; value: string }

const ZIP_RE = /^\d{5}$/

export const createZipCode = (value: string): Result<ZipCode, ZipCodeError> => {
  const trimmed = value.trim()
  if (!ZIP_RE.test(trimmed)) return err({ kind: 'ZipCodeInvalid', value })
  return ok(trimmed as ZipCode)
}
