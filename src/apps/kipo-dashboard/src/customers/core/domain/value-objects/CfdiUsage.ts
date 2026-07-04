import { ok, err, type Result } from '@/src/shared/domain/result'

export type CfdiUsage = string & { readonly _brand: 'CfdiUsage' }

// Fixed SAT code for generic RFC scenarios
export const GENERIC_CFDI_USAGE = 'S01' as CfdiUsage

export type CfdiUsageError = { kind: 'CfdiUsageInvalid'; value: string }

// Format validation only — backend validates against the SAT catalog
const CFDI_USAGE_RE = /^[A-Z]{1,2}\d{2}$/

export const createCfdiUsage = (value: string): Result<CfdiUsage, CfdiUsageError> => {
  if (!CFDI_USAGE_RE.test(value.trim())) return err({ kind: 'CfdiUsageInvalid', value })
  return ok(value.trim() as CfdiUsage)
}
