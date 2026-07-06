import { ok, err, isErr, type Result } from '@/src/shared/domain/result'

import {
  createNaturalPerson,
  createLegalEntity,
  createGeneralPublic,
  createForeignPerson,
} from '../../domain/entities/Customer'
import { createRfc } from '../../domain/value-objects/TaxId'
import { createTaxRegime } from '../../domain/value-objects/TaxRegime'
import { createZipCode } from '../../domain/value-objects/ZipCode'
import { createLegalName } from '../../domain/value-objects/LegalName'
import { createCfdiUsage } from '../../domain/value-objects/CfdiUsage'

import type { TenantId } from '@/src/customers/core/domain/value-objects/TenantId'
import type { Customer } from '../../domain/entities/Customer'
import type { CreateCustomerDTO } from '../dtos/CreateCustomerDTO'
import type { CustomerError, CustomerFieldError } from '../../domain/exceptions/customer.errors'
import type { ICustomerRepository } from '../../domain/repositories/ICustomerRepository'

type Deps = { customerRepo: ICustomerRepository }

export const createCustomerUseCase =
  (deps: Deps) =>
    async (dto: CreateCustomerDTO): Promise<Result<Customer, CustomerError>> => {
      const userId = dto.userId as TenantId

      // Generic types: domain enforces fixed RFC/regime/usage, only legalName + zipCode needed
      if (dto.type === 'general') {
        const zipResult = createZipCode(dto.zipCode)
        const nameResult = createLegalName(dto.legalName)
        if (isErr(zipResult)) return err({ kind: 'ValidationError', fields: [{ field: 'zipCode', ...zipResult.error }] })
        if (isErr(nameResult)) return err({ kind: 'ValidationError', fields: [{ field: 'legalName', ...nameResult.error }] })
        return ok(createGeneralPublic(userId, zipResult.value, nameResult.value))
      }

      if (dto.type === 'foreign') {
        const zipResult = createZipCode(dto.zipCode)
        const nameResult = createLegalName(dto.legalName)
        if (isErr(zipResult)) return err({ kind: 'ValidationError', fields: [{ field: 'zipCode', ...zipResult.error }] })
        if (isErr(nameResult)) return err({ kind: 'ValidationError', fields: [{ field: 'legalName', ...nameResult.error }] })
        return ok(createForeignPerson(userId, nameResult.value, zipResult.value))
      }

      // Natural / legal persons: validate all 4+1 critical SAT fields
      const rfcResult = createRfc(dto.rfc)
      const taxRegimeResult = createTaxRegime(dto.taxRegime)
      const zipResult = createZipCode(dto.zipCode)
      const nameResult = createLegalName(dto.legalName)
      const usageResult = createCfdiUsage(dto.cfdiUsage)

      const fieldErrors: CustomerFieldError[] = []
      if (isErr(rfcResult)) fieldErrors.push({ field: 'rfc', ...rfcResult.error })
      if (isErr(taxRegimeResult)) fieldErrors.push({ field: 'taxRegime', ...taxRegimeResult.error })
      if (isErr(zipResult)) fieldErrors.push({ field: 'zipCode', ...zipResult.error })
      if (isErr(nameResult)) fieldErrors.push({ field: 'legalName', ...nameResult.error })
      if (isErr(usageResult)) fieldErrors.push({ field: 'cfdiUsage', ...usageResult.error })
      if (fieldErrors.length) return err({ kind: 'ValidationError', fields: fieldErrors })

      if (isErr(rfcResult) || isErr(taxRegimeResult) || isErr(zipResult) || isErr(nameResult) || isErr(usageResult)) {
        return err({ kind: 'ValidationError', fields: [] })
      }

      // RFC uniqueness is per tenant, not global
      const existing = await deps.customerRepo.findByRfc(rfcResult.value.rfc, userId)
      if (existing) return err({ kind: 'CustomerAlreadyExists', rfc: dto.rfc, userId: dto.userId })

      const base = {
        userId,
        rfc: rfcResult.value.rfc,
        legalName: nameResult.value,
        taxRegime: taxRegimeResult.value,
        zipCode: zipResult.value,
        cfdiUsage: usageResult.value,
      }

      const customer: Customer = dto.type === 'legal'
        ? createLegalEntity(base)
        : createNaturalPerson(base)

      await deps.customerRepo.save(customer)
      return ok(customer)
    }
