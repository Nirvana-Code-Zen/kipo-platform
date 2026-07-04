import { ok, err, type Result } from '@/src/shared/domain/result'

export type InvoiceId = string & { readonly _brand: 'InvoiceId' }
export type InvoiceIdError = { kind: 'InvalidInvoiceId'; value: string }

export const createInvoiceId = (value: string): Result<InvoiceId, InvoiceIdError> => {
  if (!value?.trim()) return err({ kind: 'InvalidInvoiceId', value })
  return ok(value.trim() as InvoiceId)
}

export const generateInvoiceId = (): InvoiceId => crypto.randomUUID() as InvoiceId
