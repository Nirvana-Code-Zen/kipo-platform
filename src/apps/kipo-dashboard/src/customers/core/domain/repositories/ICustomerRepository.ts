import type { Customer } from '../entities/Customer'
import type { CustomerId } from '../value-objects/CustomerId'
import type { Rfc } from '../value-objects/Rfc'
import type { TenantId } from '@/src/customers/core/domain/value-objects/TenantId'

export type ICustomerRepository = {
  findById: (id: CustomerId) => Promise<Customer | null>
  findByRfc: (rfc: Rfc, userId: TenantId) => Promise<Customer | null>
  findAllByUser: (userId: TenantId) => Promise<Customer[]>
  save: (customer: Customer) => Promise<void>
  update: (customer: Customer) => Promise<void>
  delete: (id: CustomerId) => Promise<void>
}
