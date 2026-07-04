'use client'

import { useCustomers } from '../hooks/useCustomers'
import { usesGenericRfc } from '../../core/domain/entities/Customer'

import type { Customer } from '../../core/domain/entities/Customer'
import type { TenantId } from '@/src/customers/core/domain/value-objects/TenantId'

const TYPE_LABEL: Record<Customer['type'], string> = {
  natural: 'Física',
  legal: 'Moral',
  general: 'Público General',
  foreign: 'Extranjero',
}

type Props = { userId: TenantId }

export function CustomersDashboard ({ userId }: Props) {
  const { data, isLoading, error, refetch } = useCustomers(userId)

  if (isLoading) return <p className='text-center py-12 text-gray-500'>Cargando clientes...</p>
  if (error) return <p className='text-red-600 p-4'>Error: {error}</p>

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='font-display text-2xl font-semibold text-gray-900'>Clientes</h1>
        <div className='flex gap-2'>
          <button
            onClick={refetch}
            type='button'
            className='text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50'
          >
            Actualizar
          </button>
          <a
            href='/customers/new'
            className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'
          >
            Nuevo cliente
          </a>
        </div>
      </div>

      {!data.length
        ? (
          <p className='text-center py-12 text-gray-400 text-sm'>Sin clientes registrados.</p>
          )
        : (
          <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>RFC</th>
                  <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Nombre / Razón Social</th>
                  <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Tipo</th>
                  <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Régimen</th>
                  <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Uso CFDI</th>
                  <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>C.P.</th>
                </tr>
              </thead>
              <tbody>
                {data.map((customer) => (
                  <tr key={customer.id} className='border-b border-gray-100 hover:bg-gray-50'>
                    <td className='py-3 px-4 font-financial text-sm'>
                      {customer.rfc}
                      {usesGenericRfc(customer) && (
                        <span className='ml-2 text-xs text-gray-400'>(genérico)</span>
                      )}
                    </td>
                    <td className='py-3 px-4 text-sm'>{customer.legalName}</td>
                    <td className='py-3 px-4 text-sm text-gray-600'>{TYPE_LABEL[customer.type]}</td>
                    <td className='py-3 px-4 font-financial text-sm text-gray-600'>{customer.taxRegime}</td>
                    <td className='py-3 px-4 font-financial text-sm text-gray-600'>{customer.cfdiUsage}</td>
                    <td className='py-3 px-4 font-financial text-sm'>{customer.zipCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
    </div>
  )
}
