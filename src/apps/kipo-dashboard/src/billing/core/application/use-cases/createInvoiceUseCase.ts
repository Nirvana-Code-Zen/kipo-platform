import { err } from '@/src/shared/domain/result'

import { createInvoice } from '../../domain/entities/Invoice'
import { createInvoiceConcept } from '../../domain/entities/InvoiceConcept'
import { billingError } from '../../domain/exceptions/billing.errors'
import { toReceiverId } from '../../domain/value-objects/ReceiverId'

import type { Result } from '@/src/shared/domain/result'
import type { IInvoiceRepository } from '../../domain/repositories/IInvoiceRepository'
import type { CreateInvoiceDTO } from '../dtos/CreateInvoiceDTO'
import type { Invoice } from '../../domain/entities/Invoice'
import type { BillingError } from '../../domain/exceptions/billing.errors'

type Deps = { invoiceRepo: IInvoiceRepository }

export const createInvoiceUseCase =
  (deps: Deps) =>
    async (dto: CreateInvoiceDTO): Promise<Result<Invoice, BillingError>> => {
      if (!dto.items.length) {
        return err(billingError.network('Invoice must have at least one item'))
      }

      const items = dto.items.map(createInvoiceConcept)

      const invoice = createInvoice({
        series: dto.series,
        issuedAt: new Date(),
        currency: dto.currency,
        exchangeRate: dto.exchangeRate,
        voucherType: dto.voucherType,
        paymentMethod: dto.paymentMethod,
        paymentForm: dto.paymentForm,
        issuerZipCode: dto.issuerZipCode,
        exportType: dto.exportType,
        receiverId: toReceiverId(dto.receiverId),
        items,
      })

      return deps.invoiceRepo.save(invoice)
    }
