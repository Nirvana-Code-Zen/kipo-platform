import { ok, err, type Result } from '@/src/shared/domain/result'

export type CustomerId = string & { readonly _brand: 'CustomerId' }
export type CustomerIdError = { kind: 'InvalidCustomerId'; value: string }

export const createCustomerId = (value: string): Result<CustomerId, CustomerIdError> => {
  if (!value?.trim()) return err({ kind: 'InvalidCustomerId', value })
  return ok(value.trim() as CustomerId)
}

export const generateCustomerId = (): CustomerId => crypto.randomUUID() as CustomerId
