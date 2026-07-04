import { ok, err } from '@/src/shared/domain/result'

import { InvoiceMapper, type RawInvoice } from '../mappers/InvoiceMapper'
import { billingError } from '../../domain/exceptions/billing.errors'

import type { IInvoiceRepository, InvoiceFilters } from '../../domain/repositories/IInvoiceRepository'
import type { Invoice } from '../../domain/entities/Invoice'
import type { InvoiceId } from '../../domain/value-objects/InvoiceId'
import type { BillingError } from '../../domain/exceptions/billing.errors'
import type { Result } from '@/src/shared/domain/result'

export const createHttpInvoiceRepository = (baseUrl: string): IInvoiceRepository => {
  const request = async <T>(
    path: string,
    options?: RequestInit
  ): Promise<Result<T, BillingError>> => {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
      })
      if (res.status === 404) {
        return err(billingError.notFound(path.split('/').at(-1) ?? ''))
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string }
        return err(billingError.server(res.status, body.message ?? res.statusText))
      }
      return ok(await res.json() as T)
    } catch (e) {
      return err(billingError.network(e instanceof Error ? e.message : 'Unknown'))
    }
  }

  return {
    findById: async (id: InvoiceId) => {
      const result = await request<RawInvoice>(`/invoices/${id}`)
      if (!result.ok) return result
      return ok(InvoiceMapper.toDomain(result.value))
    },

    findAll: async (filters?: InvoiceFilters) => {
      const params = new URLSearchParams()
      if (filters?.receiverId) params.set('receiverId', filters.receiverId)
      if (filters?.status) params.set('status', filters.status)
      if (filters?.startDate) params.set('startDate', filters.startDate.toISOString())
      if (filters?.endDate) params.set('endDate', filters.endDate.toISOString())
      const qs = params.size ? `?${params}` : ''
      const result = await request<RawInvoice[]>(`/invoices${qs}`)
      if (!result.ok) return result
      return ok(result.value.map(InvoiceMapper.toDomain))
    },

    save: async (invoice: Invoice) => {
      const result = await request<RawInvoice>('/invoices', {
        method: 'POST',
        body: JSON.stringify(InvoiceMapper.toPersistence(invoice)),
      })
      if (!result.ok) return result
      return ok(InvoiceMapper.toDomain(result.value))
    },

    update: async (invoice: Invoice) => {
      const result = await request<RawInvoice>(`/invoices/${invoice.id}`, {
        method: 'PUT',
        body: JSON.stringify(InvoiceMapper.toPersistence(invoice)),
      })
      if (!result.ok) return result
      return ok(InvoiceMapper.toDomain(result.value))
    },

    stamp: async (id: InvoiceId) => {
      const result = await request<RawInvoice>(`/invoices/${id}/stamp`, { method: 'POST' })
      if (!result.ok) return result
      return ok(InvoiceMapper.toDomain(result.value))
    },

    cancel: async (id: InvoiceId, reason: string) => {
      const result = await request<RawInvoice>(`/invoices/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      })
      if (!result.ok) return result
      return ok(InvoiceMapper.toDomain(result.value))
    },
  }
}
