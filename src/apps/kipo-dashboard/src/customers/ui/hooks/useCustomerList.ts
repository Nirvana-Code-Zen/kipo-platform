"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { CustomerApiMapper } from "@/src/customers/core/infrastructure/mappers/CustomerApiMapper"

import type { CustomerApiResponse } from "@/src/customers/core/application/dtos/CustomerApiDTO"
import type { Customer } from "../components/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const PAGE_SIZE = 12

export function useCustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const offsetRef = useRef(0)
  const fetchingRef = useRef(false)
  const hasMoreRef = useRef(true)

  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasMoreRef.current) return
    fetchingRef.current = true

    const isInitial = offsetRef.current === 0
    if (isInitial) setIsLoading(true)
    else setIsFetchingMore(true)

    try {
      const token = useAuthStore.getState().accessToken
      const res = await fetch(
        `${API_BASE_URL}/api/v1/customers?limit=${PAGE_SIZE}&offset=${offsetRef.current}`,
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      )

      if (!res.ok) {
        hasMoreRef.current = false
        setHasMore(false)
        return
      }

      const raw = (await res.json()) as CustomerApiResponse[]
      const mapped = raw.map(CustomerApiMapper.fromApiResponse)

      setCustomers((prev) => (isInitial ? mapped : [...prev, ...mapped]))
      offsetRef.current += mapped.length

      if (mapped.length < PAGE_SIZE) {
        hasMoreRef.current = false
        setHasMore(false)
      }
    } catch {
      hasMoreRef.current = false
      setHasMore(false)
    } finally {
      fetchingRef.current = false
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }, [])

  useEffect(() => {
    loadMore()
  }, [loadMore])

  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => [customer, ...prev])
    offsetRef.current += 1
  }

  const toggleStatus = (id: string) =>
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    )

  const deleteCustomer = (id: string) =>
    setCustomers((prev) => prev.filter((c) => c.id !== id))

  const updateCustomer = (updated: Customer) => {
    setEditingCustomer(null)
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    )
  }

  return {
    customers,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    selectedCustomer,
    editingCustomer,
    setSelectedCustomer,
    setEditingCustomer,
    addCustomer,
    toggleStatus,
    deleteCustomer,
    updateCustomer,
  }
}
