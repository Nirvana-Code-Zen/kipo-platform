import { ok, err, type Result } from '@/src/shared/domain/result'

export type Email = string & { readonly _brand: 'Email' }

export type EmailError =
  | { kind: 'EmailEmpty' }
  | { kind: 'EmailInvalid'; value: string }
  | { kind: 'EmailTooLong'; maxLength: number }

const MAX_LENGTH = 254
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const createEmail = (value: string): Result<Email, EmailError> => {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return err({ kind: 'EmailEmpty' })
  if (trimmed.length > MAX_LENGTH) return err({ kind: 'EmailTooLong', maxLength: MAX_LENGTH })
  if (!EMAIL_RE.test(trimmed)) return err({ kind: 'EmailInvalid', value: trimmed })
  return ok(trimmed as Email)
}
