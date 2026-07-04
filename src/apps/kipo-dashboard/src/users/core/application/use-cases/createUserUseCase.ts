import { ok, err, isErr, type Result } from '@/src/shared/domain/result'

import { createNaturalPerson, createLegalEntity, createForeignPerson } from '../../domain/entities/User'
import { createRfc } from '../../domain/value-objects/Rfc'
import { createTaxRegime } from '../../domain/value-objects/TaxRegime'
import { createZipCode } from '../../domain/value-objects/ZipCode'
import { createLegalName } from '../../domain/value-objects/LegalName'

import type { User } from '../../domain/entities/User'
import type { CreateUserDTO } from '../dtos/CreateUserDTO'
import type { UserError, UserFieldError } from '../../domain/exceptions/user.errors'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'

type Deps = { userRepo: IUserRepository }

export const createUserUseCase =
  (deps: Deps) =>
    async (dto: CreateUserDTO): Promise<Result<User, UserError>> => {
      const rfcResult = createRfc(dto.rfc)
      const taxRegimeResult = createTaxRegime(dto.taxRegime)
      const zipResult = createZipCode(dto.zipCode)
      const nameResult = createLegalName(dto.legalName)

      const fieldErrors: UserFieldError[] = []
      if (isErr(rfcResult)) fieldErrors.push({ field: 'rfc', ...rfcResult.error })
      if (isErr(taxRegimeResult)) fieldErrors.push({ field: 'taxRegime', ...taxRegimeResult.error })
      if (isErr(zipResult)) fieldErrors.push({ field: 'zipCode', ...zipResult.error })
      if (isErr(nameResult)) fieldErrors.push({ field: 'legalName', ...nameResult.error })
      if (fieldErrors.length) return err({ kind: 'ValidationError', fields: fieldErrors })

      if (isErr(rfcResult) || isErr(taxRegimeResult) || isErr(zipResult) || isErr(nameResult)) {
        return err({ kind: 'ValidationError', fields: [] })
      }

      const existing = await deps.userRepo.findByRfc(rfcResult.value.rfc)
      if (existing) return err({ kind: 'UserAlreadyExists', rfc: dto.rfc })

      const input = {
        rfc: rfcResult.value.rfc,
        legalName: nameResult.value,
        taxRegime: taxRegimeResult.value,
        zipCode: zipResult.value,
      }

      // Prefer dto.type; fall back to RFC-derived type
      const resolvedType = dto.type === 'foreign' ? 'foreign' : rfcResult.value.type

      const user: User =
      resolvedType === 'legal'
        ? createLegalEntity(input)
        : resolvedType === 'foreign'
          ? createForeignPerson(input)
          : createNaturalPerson(input)

      await deps.userRepo.save(user)
      return ok(user)
    }
