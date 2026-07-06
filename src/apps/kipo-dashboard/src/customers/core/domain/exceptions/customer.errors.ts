import type { RfcError } from '../value-objects/TaxId'
import type { TaxRegimeError } from '../value-objects/TaxRegime'
import type { ZipCodeError } from '../value-objects/ZipCode'
import type { LegalNameError } from '../value-objects/LegalName'
import type { CfdiUsageError } from '../value-objects/CfdiUsage'

export type CustomerError =
  | { kind: 'CustomerNotFound'; id: string }
  | { kind: 'CustomerAlreadyExists'; rfc: string; userId: string }
  | { kind: 'ValidationError'; fields: CustomerFieldError[] }

export type CustomerFieldError =
  | ({ field: 'rfc' } & RfcError)
  | ({ field: 'taxRegime' } & TaxRegimeError)
  | ({ field: 'zipCode' } & ZipCodeError)
  | ({ field: 'legalName' } & LegalNameError)
  | ({ field: 'cfdiUsage' } & CfdiUsageError)
