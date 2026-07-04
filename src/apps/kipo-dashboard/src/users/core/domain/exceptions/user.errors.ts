import type { RfcError } from '../value-objects/Rfc'
import type { TaxRegimeError } from '../value-objects/TaxRegime'
import type { ZipCodeError } from '../value-objects/ZipCode'
import type { LegalNameError } from '../value-objects/LegalName'

export type UserError =
  | { kind: 'UserNotFound'; id: string }
  | { kind: 'UserAlreadyExists'; rfc: string }
  | { kind: 'RfcNotActiveInSat'; rfc: string }
  | { kind: 'ValidationError'; fields: UserFieldError[] }

export type UserFieldError =
  | ({ field: 'rfc' } & RfcError)
  | ({ field: 'taxRegime' } & TaxRegimeError)
  | ({ field: 'zipCode' } & ZipCodeError)
  | ({ field: 'legalName' } & LegalNameError)
