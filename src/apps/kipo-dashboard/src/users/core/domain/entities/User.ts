import { generateUserId } from '../value-objects/UserId'

import type { UserId } from '../value-objects/UserId'
import type { Rfc } from '../value-objects/Rfc'
import type { TaxRegime } from '../value-objects/TaxRegime'
import type { ZipCode } from '../value-objects/ZipCode'
import type { LegalName } from '../value-objects/LegalName'

type UserBase = Readonly<{
  id: UserId
  rfc: Rfc
  legalName: LegalName
  taxRegime: TaxRegime
  zipCode: ZipCode
  createdAt: Date
  updatedAt: Date
}>

export type NaturalPerson = UserBase & Readonly<{ type: 'natural' }>
export type LegalEntity = UserBase & Readonly<{ type: 'legal' }>
export type ForeignPerson = UserBase & Readonly<{ type: 'foreign' }>

export type User = NaturalPerson | LegalEntity | ForeignPerson

type UserInput = {
  rfc: Rfc
  legalName: LegalName
  taxRegime: TaxRegime
  zipCode: ZipCode
}

export const createNaturalPerson = (input: UserInput): NaturalPerson => ({
  id: generateUserId(),
  type: 'natural',
  ...input,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const createLegalEntity = (input: UserInput): LegalEntity => ({
  id: generateUserId(),
  type: 'legal',
  ...input,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const createForeignPerson = (input: UserInput): ForeignPerson => ({
  id: generateUserId(),
  type: 'foreign',
  ...input,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const updateZipCode = (user: User, zipCode: ZipCode): User =>
  ({ ...user, zipCode, updatedAt: new Date() })

export const updateTaxRegime = (user: User, taxRegime: TaxRegime): User =>
  ({ ...user, taxRegime, updatedAt: new Date() })

export const isNaturalPerson = (u: User): u is NaturalPerson => u.type === 'natural'
export const isLegalEntity = (u: User): u is LegalEntity => u.type === 'legal'
export const isForeignPerson = (u: User): u is ForeignPerson => u.type === 'foreign'
