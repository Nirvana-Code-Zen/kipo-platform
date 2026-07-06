"use client"

import { useState, useMemo } from "react"

export type ReceiverSuggestion = {
  taxId: string
  name: string
  taxRegime?: string
}

const MOCK_RECEIVERS: ReceiverSuggestion[] = [
  { taxId: "MCS900101AAA", name: "Maximo Coseti SA de CV",     taxRegime: "Régimen Simplificado de Confianza" },
  { taxId: "ESE010101BBB", name: "elacond Servicios",          taxRegime: "Régimen General de Ley" },
  { taxId: "CDS200101CCC", name: "cuate Dev SC",               taxRegime: "Régimen de Incorporación Fiscal" },
  { taxId: "XXX052SED-1",  name: "Maximo coseti",              taxRegime: "Régimen Simplificado de Confianza" },
  { taxId: "XXX052SED-2",  name: "elacond",                    taxRegime: "Régimen General de Ley" },
  { taxId: "XXX052SED-3",  name: "cuate",                      taxRegime: "Régimen de Incorporación Fiscal" },
]

export function useReceiverSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return MOCK_RECEIVERS.filter(
      (r) =>
        r.taxId.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)
    ).slice(0, 5)
  }, [query])

  const clear = () => {
    setQuery("")
    setIsOpen(false)
  }

  return { query, setQuery, isOpen, setIsOpen, suggestions, clear }
}
