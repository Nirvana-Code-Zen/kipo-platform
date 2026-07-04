import type { Result } from '@/src/shared/domain/result'
import type { Invoice, InvoiceStatus } from '../entities/Invoice'
import type { InvoiceId } from '../value-objects/InvoiceId'
import type { ReceiverId } from '../value-objects/ReceiverId'
import type { BillingError } from '../exceptions/billing.errors'

export type InvoiceFilters = {
  receiverId?: ReceiverId
  status?: InvoiceStatus
  startDate?: Date
  endDate?: Date
}

export type IInvoiceRepository = {
  findById: (id: InvoiceId) => Promise<Result<Invoice, BillingError>>
  findAll: (filters?: InvoiceFilters) => Promise<Result<Invoice[], BillingError>>
  save: (invoice: Invoice) => Promise<Result<Invoice, BillingError>>
  update: (invoice: Invoice) => Promise<Result<Invoice, BillingError>>
  stamp: (id: InvoiceId) => Promise<Result<Invoice, BillingError>>
  cancel: (id: InvoiceId, reason: string) => Promise<Result<Invoice, BillingError>>
}
