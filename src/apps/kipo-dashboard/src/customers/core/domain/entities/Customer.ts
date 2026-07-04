import { generateCustomerId } from '../value-objects/CustomerId'
import { RFC_GENERAL, RFC_FOREIGN } from '../value-objects/Rfc'
import { GENERIC_TAX_REGIME } from '../value-objects/TaxRegime'
import { GENERIC_CFDI_USAGE } from '../value-objects/CfdiUsage'

import type { CustomerId } from '../value-objects/CustomerId'
import type { Rfc } from '../value-objects/Rfc'
import type { TaxRegime } from '../value-objects/TaxRegime'
import type { ZipCode } from '../value-objects/ZipCode'
import type { LegalName } from '../value-objects/LegalName'
import type { CfdiUsage } from '../value-objects/CfdiUsage'
import type { TenantId } from '@/src/customers/core/domain/value-objects/TenantId'

type CustomerBase = Readonly<{
  id: CustomerId
  userId: TenantId
  rfc: Rfc
  legalName: LegalName
  taxRegime: TaxRegime
  zipCode: ZipCode
  cfdiUsage: CfdiUsage
  createdAt: Date
  updatedAt: Date
}>

export type NaturalPerson = CustomerBase & Readonly<{ type: 'natural' }>
export type LegalEntity = CustomerBase & Readonly<{ type: 'legal' }>
// SAT generic RFC — domain enforces XAXX, regime 616, usage S01
export type GeneralPublic = CustomerBase & Readonly<{ type: 'general' }>
// SAT generic RFC — domain enforces XEXX, regime 616, usage S01
export type ForeignPerson = CustomerBase & Readonly<{ type: 'foreign' }>

export type Customer = NaturalPerson | LegalEntity | GeneralPublic | ForeignPerson

type BaseInput = {
  userId: TenantId
  rfc: Rfc
  legalName: LegalName
  taxRegime: TaxRegime
  zipCode: ZipCode
  cfdiUsage: CfdiUsage
}

export const createNaturalPerson = (input: BaseInput): NaturalPerson => ({
  id: generateCustomerId(),
  type: 'natural',
  ...input,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const createLegalEntity = (input: BaseInput): LegalEntity => ({
  id: generateCustomerId(),
  type: 'legal',
  ...input,
  createdAt: new Date(),
  updatedAt: new Date(),
})

// General public — SAT enforces fixed RFC/regime/usage, domain guarantees it
export const createGeneralPublic = (
  userId: TenantId,
  zipCode: ZipCode,
  legalName: LegalName
): GeneralPublic => ({
  id: generateCustomerId(),
  type: 'general',
  userId,
  rfc: RFC_GENERAL,
  legalName,
  taxRegime: GENERIC_TAX_REGIME,
  zipCode,
  cfdiUsage: GENERIC_CFDI_USAGE,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const createForeignPerson = (
  userId: TenantId,
  legalName: LegalName,
  zipCode: ZipCode
): ForeignPerson => ({
  id: generateCustomerId(),
  type: 'foreign',
  userId,
  rfc: RFC_FOREIGN,
  legalName,
  taxRegime: GENERIC_TAX_REGIME,
  zipCode,
  cfdiUsage: GENERIC_CFDI_USAGE,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const updateZipCode = (customer: Customer, zipCode: ZipCode): Customer =>
  ({ ...customer, zipCode, updatedAt: new Date() })

export const updateCfdiUsage = (customer: Customer, cfdiUsage: CfdiUsage): Customer =>
  ({ ...customer, cfdiUsage, updatedAt: new Date() })

export const isNaturalPerson = (c: Customer): c is NaturalPerson => c.type === 'natural'
export const isLegalEntity = (c: Customer): c is LegalEntity => c.type === 'legal'
export const isGeneralPublic = (c: Customer): c is GeneralPublic => c.type === 'general'
export const isForeignPerson = (c: Customer): c is ForeignPerson => c.type === 'foreign'
export const usesGenericRfc = (c: Customer): boolean => c.type === 'general' || c.type === 'foreign'
