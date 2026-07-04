import { ok, err, type Result } from '@/src/shared/domain/result'

export type UserId = string & { readonly _brand: 'UserId' }

export type UserIdError = { kind: 'InvalidUserId'; value: string }

export const createUserId = (value: string): Result<UserId, UserIdError> => {
  if (!value || value.trim().length === 0) {
    return err({ kind: 'InvalidUserId', value })
  }
  return ok(value.trim() as UserId)
}

export const generateUserId = (): UserId =>
  crypto.randomUUID() as UserId
