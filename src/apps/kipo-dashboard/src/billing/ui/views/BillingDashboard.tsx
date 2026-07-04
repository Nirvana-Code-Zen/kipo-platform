'use client'

import { useEffect } from 'react'

import { useInvoices } from '../hooks/useInvoices'

import type { Invoice } from '../../core/domain/entities/Invoice'
import type { InvoiceId } from '../../core/domain/value-objects/InvoiceId'

const STATUS_LABEL: Record<Invoice['status'], string> = {
  draft: 'Borrador',
  stamped: 'Timbrado',
  cancelled: 'Cancelado',
}

const STATUS_COLOR: Record<Invoice['status'], string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  stamped: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

type InvoiceRowProps = {
  invoice: Invoice
  onSelect: (invoice: Invoice) => void
  onStamp: (id: InvoiceId) => void
}

const InvoiceRow = ({ invoice, onSelect, onStamp }: InvoiceRowProps) => (
  <tr
    className='border-b border-gray-100 hover:bg-gray-50 cursor-pointer'
    onClick={() => onSelect(invoice)}
  >
    <td className='py-3 px-4 font-financial text-sm'>
      {invoice.invoiceNumber ?? invoice.id.slice(0, 8)}
    </td>
    <td className='py-3 px-4 font-financial text-sm text-gray-600'>{invoice.receiverId}</td>
    <td className='py-3 px-4 text-sm text-gray-600'>{invoice.voucherType}</td>
    <td className='py-3 px-4 text-sm text-gray-600'>{invoice.paymentMethod}</td>
    <td className='py-3 px-4 text-right font-financial text-sm'>
      {invoice.currency} {invoice.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
    </td>
    <td className='py-3 px-4'>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[invoice.status]}`}>
        {STATUS_LABEL[invoice.status]}
      </span>
    </td>
    <td className='py-3 px-4 text-right'>
      {invoice.status === 'draft' && (
        <button
          className='text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors'
          onClick={(e) => { e.stopPropagation(); onStamp(invoice.id) }}
        >
          Timbrar
        </button>
      )}
    </td>
  </tr>
)

export const BillingDashboard = () => {
  const { invoices, loading, error, fetchInvoices, stampInvoice, setSelected } = useInvoices()

  useEffect(() => { fetchInvoices() }, [fetchInvoices])

  if (loading && !invoices.length) {
    return <p className='text-center py-12 text-gray-500'>Cargando facturas...</p>
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='font-display text-2xl font-semibold text-gray-900'>Facturación</h1>
        <a
          href='/billing/new'
          className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'
        >
          Nueva factura
        </a>
      </div>

      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700'>
          {error.kind === 'NetworkError' || error.kind === 'ServerError'
            ? error.message
            : error.kind}
        </div>
      )}

      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Folio</th>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Receptor</th>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Tipo</th>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Método</th>
              <th className='text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Total</th>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Estado</th>
              <th className='text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0
              ? (
                <tr>
                  <td colSpan={7} className='py-12 text-center text-gray-400 text-sm'>
                    No hay facturas registradas
                  </td>
                </tr>
                )
              : (
                  invoices.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      onSelect={setSelected}
                      onStamp={stampInvoice}
                    />
                  ))
                )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
