import { generateCustomerId } from '../value-objects/CustomerId'
import { TaxId_GENERAL, TaxId_FOREIGN } from '../value-objects/TaxId'
import { GENERIC_TAX_REGIME } from '../value-objects/TaxRegime'
import { GENERIC_CFDI_USAGE } from '../value-objects/CfdiUsage'
import { DEFAULT_STATUS } from '../value-objects/CustomerStatus'
import { getInitials } from '../value-objects/AvatarUrl'

import type { CustomerId } from '../value-objects/CustomerId'
import type { TaxId } from '../value-objects/TaxId'
import type { TaxRegime } from '../value-objects/TaxRegime'
import type { ZipCode } from '../value-objects/ZipCode'
import type { LegalName } from '../value-objects/LegalName'
import type { CfdiUsage } from '../value-objects/CfdiUsage'
import type { TenantId } from '@/src/customers/core/domain/value-objects/TenantId'
import type { Email } from '../value-objects/Email'
import type { CustomerStatus } from '../value-objects/CustomerStatus'
import type { AvatarUrl } from '../value-objects/AvatarUrl'

export type { getInitials }

type CustomerBase = Readonly<{
  id: CustomerId
  userId: TenantId
  taxId: TaxId
  legalName: LegalName
  taxRegime: TaxRegime
  zipCode: ZipCode
  cfdiUsage: CfdiUsage
  email: Email
  status: CustomerStatus
  avatarUrl?: AvatarUrl
  createdAt: Date
  updatedAt: Date
}>

export type NaturalPerson = CustomerBase & Readonly<{ type: 'natural' }>
export type LegalEntity = CustomerBase & Readonly<{ type: 'legal' }>
export type GeneralPublic = CustomerBase & Readonly<{ type: 'general' }>
export type ForeignPerson = CustomerBase & Readonly<{ type: 'foreign' }>

export type Customer = NaturalPerson | LegalEntity | GeneralPublic | ForeignPerson

type BaseInput = {
  userId: TenantId
  taxId: TaxId
  legalName: LegalName
  taxRegime: TaxRegime
  zipCode: ZipCode
  cfdiUsage: CfdiUsage
  email: Email
  status?: CustomerStatus
  avatarUrl?: AvatarUrl
}

export const createNaturalPerson = (input: BaseInput): NaturalPerson => ({
  id: generateCustomerId(),
  type: 'natural',
  ...input,
  status: input.status ?? DEFAULT_STATUS,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const createLegalEntity = (input: BaseInput): LegalEntity => ({
  id: generateCustomerId(),
  type: 'legal',
  ...input,
  status: input.status ?? DEFAULT_STATUS,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const createGeneralPublic = (
  userId: TenantId,
  zipCode: ZipCode,
  legalName: LegalName,
  email: Email,
  avatarUrl?: AvatarUrl,
): GeneralPublic => ({
  id: generateCustomerId(),
  type: 'general',
  userId,
  taxId: TaxId_GENERAL,
  legalName,
  taxRegime: GENERIC_TAX_REGIME,
  zipCode,
  cfdiUsage: GENERIC_CFDI_USAGE,
  email,
  status: DEFAULT_STATUS,
  avatarUrl,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const createForeignPerson = (
  userId: TenantId,
  legalName: LegalName,
  zipCode: ZipCode,
  email: Email,
  avatarUrl?: AvatarUrl,
): ForeignPerson => ({
  id: generateCustomerId(),
  type: 'foreign',
  userId,
  taxId: TaxId_FOREIGN,
  legalName,
  taxRegime: GENERIC_TAX_REGIME,
  zipCode,
  cfdiUsage: GENERIC_CFDI_USAGE,
  email,
  status: DEFAULT_STATUS,
  avatarUrl,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const updateZipCode = (customer: Customer, zipCode: ZipCode): Customer =>
  ({ ...customer, zipCode, updatedAt: new Date() })

export const updateCfdiUsage = (customer: Customer, cfdiUsage: CfdiUsage): Customer =>
  ({ ...customer, cfdiUsage, updatedAt: new Date() })

export const updateEmail = (customer: Customer, email: Email): Customer =>
  ({ ...customer, email, updatedAt: new Date() })

export const updateStatus = (customer: Customer, status: CustomerStatus): Customer =>
  ({ ...customer, status, updatedAt: new Date() })

export const updateAvatarUrl = (customer: Customer, avatarUrl: AvatarUrl): Customer =>
  ({ ...customer, avatarUrl, updatedAt: new Date() })

export const isNaturalPerson = (c: Customer): c is NaturalPerson => c.type === 'natural'
export const isLegalEntity = (c: Customer): c is LegalEntity => c.type === 'legal'
export const isGeneralPublic = (c: Customer): c is GeneralPublic => c.type === 'general'
export const isForeignPerson = (c: Customer): c is ForeignPerson => c.type === 'foreign'
export const usesGenerictaxId = (c: Customer): boolean => c.type === 'general' || c.type === 'foreign'
