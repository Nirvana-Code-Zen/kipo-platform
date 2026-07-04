'use client'

import { useReducer, useState, useCallback } from 'react'

import { isErr } from '@/src/shared/domain/result'

import { createHttpInvoiceRepository } from '../../core/infrastructure/repositories/HttpInvoiceRepository'
import { createInvoiceUseCase } from '../../core/application/use-cases/createInvoiceUseCase'

import type { Invoice } from '../../core/domain/entities/Invoice'
import type { BillingError } from '../../core/domain/exceptions/billing.errors'
import type { CreateInvoiceDTO } from '../../core/application/dtos/CreateInvoiceDTO'
import type { InvoiceId } from '../../core/domain/value-objects/InvoiceId'

type State = {
  invoices: Invoice[]
  loading: boolean
  error: BillingError | null
}

type Action =
  | { type: 'LOADING' }
  | { type: 'LOADED'; invoices: Invoice[] }
  | { type: 'INVOICE_SAVED'; invoice: Invoice }
  | { type: 'INVOICE_UPDATED'; invoice: Invoice }
  | { type: 'ERROR'; error: BillingError }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOADING': return { ...state, loading: true, error: null }
    case 'LOADED': return { loading: false, error: null, invoices: action.invoices }
    case 'INVOICE_SAVED': return { ...state, loading: false, invoices: [...state.invoices, action.invoice] }
    case 'INVOICE_UPDATED': return {
      ...state,
      loading: false,
      invoices: state.invoices.map((i) => i.id === action.invoice.id ? action.invoice : i),
    }
    case 'ERROR': return { ...state, loading: false, error: action.error }
  }
}

const invoiceRepo = createHttpInvoiceRepository(process.env.NEXT_PUBLIC_API_URL ?? '')

export const useInvoices = () => {
  const [state, dispatch] = useReducer(reducer, { invoices: [], loading: false, error: null })
  const [selected, setSelected] = useState<Invoice | null>(null)

  const fetchInvoices = useCallback(async () => {
    dispatch({ type: 'LOADING' })
    const result = await invoiceRepo.findAll()
    if (isErr(result)) { dispatch({ type: 'ERROR', error: result.error }); return }
    dispatch({ type: 'LOADED', invoices: result.value })
  }, [])

  const createInvoice = useCallback(async (dto: CreateInvoiceDTO) => {
    dispatch({ type: 'LOADING' })
    const result = await createInvoiceUseCase({ invoiceRepo })(dto)
    if (isErr(result)) { dispatch({ type: 'ERROR', error: result.error }); return }
    dispatch({ type: 'INVOICE_SAVED', invoice: result.value })
    return result.value
  }, [])

  const stampInvoice = useCallback(async (id: InvoiceId) => {
    dispatch({ type: 'LOADING' })
    const result = await invoiceRepo.stamp(id)
    if (isErr(result)) { dispatch({ type: 'ERROR', error: result.error }); return }
    dispatch({ type: 'INVOICE_UPDATED', invoice: result.value })
    return result.value
  }, [])

  const cancelInvoice = useCallback(async (id: InvoiceId, reason: string) => {
    dispatch({ type: 'LOADING' })
    const result = await invoiceRepo.cancel(id, reason)
    if (isErr(result)) { dispatch({ type: 'ERROR', error: result.error }); return }
    dispatch({ type: 'INVOICE_UPDATED', invoice: result.value })
    return result.value
  }, [])

  return {
    invoices: state.invoices,
    loading: state.loading,
    error: state.error,
    selected,
    setSelected,
    fetchInvoices,
    createInvoice,
    stampInvoice,
    cancelInvoice,
  }
}
