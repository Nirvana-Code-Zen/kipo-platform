import { CustomerMapper, type CustomerRaw } from '../mappers/CustomerMapper'

import type { ICustomerRepository } from '../../domain/repositories/ICustomerRepository'
import type { Customer } from '../../domain/entities/Customer'
import type { CustomerId } from '../../domain/value-objects/CustomerId'
import type { TaxId } from '../../domain/value-objects/TaxId'
import type { TenantId } from '@/src/customers/core/domain/value-objects/TenantId'

export const createHttpCustomerRepository = (baseUrl: string): ICustomerRepository => {
  const url = `${baseUrl}/customers`

  const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${url}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return res.json() as Promise<T>
  }

  return {
    findById: async (id: CustomerId) => {
      try {
        return CustomerMapper.toDomain(await request<CustomerRaw>(`/${id}`))
      } catch { return null }
    },

    findByTaxId: async (taxId: TaxId, userId: TenantId) => {
      try {
        const data = await request<CustomerRaw[]>(
          `?taxId=${encodeURIComponent(taxId)}&userId=${encodeURIComponent(userId)}`
        )
        return data.length ? CustomerMapper.toDomain(data[0]) : null
      } catch { return null }
    },

    findAllByUser: async (userId: TenantId) => {
      const data = await request<CustomerRaw[]>(`?userId=${encodeURIComponent(userId)}`)
      return data.map(CustomerMapper.toDomain)
    },

    save: async (customer: Customer) => {
      await request('', { method: 'POST', body: JSON.stringify(CustomerMapper.toPersistence(customer)) })
    },

    update: async (customer: Customer) => {
      await request(`/${customer.id}`, { method: 'PUT', body: JSON.stringify(CustomerMapper.toPersistence(customer)) })
    },

    delete: async (id: CustomerId) => {
      await request(`/${id}`, { method: 'DELETE' })
    },
  }
}
