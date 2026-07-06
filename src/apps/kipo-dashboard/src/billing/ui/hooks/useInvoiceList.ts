"use client"

import { useEffect, useState } from "react"

import type { Dispatch, SetStateAction } from "react"
import type { UIInvoice } from "../components/types"

export type { Dispatch, SetStateAction }

const initialInvoices: UIInvoice[] = [
  {
    id: "a1b2c3d4-0001",
    folio: "A-001",
    status: "stamped",
    issuedAt: "01 jul 2026",
    receiverName: "Maximo Coseti SA de CV",
    receiverTaxId: "MCS900101AAA",
    total: 14848,
    currency: "MXN",
    voucherType: "I",
    paymentMethod: "PUE",
  },
  {
    id: "a1b2c3d4-0002",
    folio: "A-002",
    status: "stamped",
    issuedAt: "28 jun 2026",
    receiverName: "elacond Servicios",
    receiverTaxId: "ESE010101BBB",
    total: 5800,
    currency: "MXN",
    voucherType: "I",
    paymentMethod: "PPD",
  },
  {
    id: "a1b2c3d4-0003",
    folio: "A-003",
    status: "draft",
    issuedAt: "05 jul 2026",
    receiverName: "cuate Dev SC",
    receiverTaxId: "CDS200101CCC",
    total: 23200,
    currency: "MXN",
    voucherType: "I",
    paymentMethod: "PUE",
  },
  {
    id: "a1b2c3d4-0004",
    folio: "A-004",
    status: "cancelled",
    issuedAt: "15 jun 2026",
    receiverName: "Maximo Coseti SA de CV",
    receiverTaxId: "MCS900101AAA",
    total: 3480,
    currency: "MXN",
    voucherType: "E",
    paymentMethod: "PUE",
  },
  {
    id: "a1b2c3d4-0005",
    folio: "A-005",
    status: "stamped",
    issuedAt: "30 jun 2026",
    receiverName: "cuate Dev SC",
    receiverTaxId: "CDS200101CCC",
    total: 9280,
    currency: "MXN",
    voucherType: "I",
    paymentMethod: "PUE",
  },
  {
    id: "a1b2c3d4-0006",
    folio: "A-006",
    status: "draft",
    issuedAt: "06 jul 2026",
    receiverName: "elacond Servicios",
    receiverTaxId: "ESE010101BBB",
    total: 17400,
    currency: "MXN",
    voucherType: "I",
    paymentMethod: "PPD",
  },
]

export type InvoiceListState = {
  invoices: UIInvoice[]
  setInvoices: Dispatch<SetStateAction<UIInvoice[]>>
  isLoading: boolean
  selectedInvoice: UIInvoice | null
  setSelectedInvoice: Dispatch<SetStateAction<UIInvoice | null>>
}

export function useInvoiceList(): InvoiceListState {
  const [invoices, setInvoices] = useState<UIInvoice[]>(initialInvoices)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<UIInvoice | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  return { invoices, setInvoices, isLoading, selectedInvoice, setSelectedInvoice }
}
