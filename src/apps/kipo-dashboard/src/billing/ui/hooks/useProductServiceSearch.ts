"use client"

import { useMemo, useState } from "react"

import { MOCK_PRODUCT_SERVICE_CODES } from "../data/mockProductServiceCodes"

const MIN_QUERY_LENGTH = 3
const MAX_SUGGESTIONS = 6

export function useProductServiceSearch(query: string) {
  const [isOpen, setIsOpen] = useState(false)

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < MIN_QUERY_LENGTH) return []
    return MOCK_PRODUCT_SERVICE_CODES.filter(
      (item) => item.description.toLowerCase().includes(q) || item.code.includes(q)
    ).slice(0, MAX_SUGGESTIONS)
  }, [query])

  return { isOpen, setIsOpen, suggestions }
}
