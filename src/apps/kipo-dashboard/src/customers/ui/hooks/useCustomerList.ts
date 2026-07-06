"use client"

import { useEffect, useState } from "react"

import type { Customer } from "../components/types"

const initialCustomers: Customer[] = [
  {
    taxId: "XXX052SED-1",
    email: "alexandra@tasko.com",
    phone: "+52 55 1234 5678",
    status: "active",
    legalName: "Maximo coseti",
    taxRegime: "Régimen Simplificado de Confianza",
    avatar: "/avatars/avatar-1.jpg",
    initials: "AD",
  },
  {
    taxId: "XXX052SED-2",
    email: "edwin@tasko.com",
    status: "inactive",
    legalName: "elacond",
    taxRegime: "Régimen General de Ley",
    avatar: "/avatars/avatar-2.jpg",
    initials: "EA",
  },
  {
    taxId: "XXX052SED-3",
    email: "isaac@tasko.com",
    phone: "+52 33 9876 5432",
    status: "active",
    legalName: "cuate",
    taxRegime: "Régimen de Incorporación Fiscal",
    avatar: "/avatars/avatar-3.jpg",
    initials: "IO",
  },
  {
    taxId: "XXX052SED-4",
    email: "david@tasko.com",
    status: "active",
    taxRegime: "Régimen Simplificado de Confianza",
    legalName: "cuate",
    avatar: "/avatars/avatar-4.jpg",
    initials: "DO",
  },
]

export function useCustomerList() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const addCustomer = (customer: Customer) =>
    setCustomers((prev) => [customer, ...prev])

  const toggleStatus = (taxId: string) =>
    setCustomers((prev) =>
      prev.map((c) =>
        c.taxId === taxId
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    )

  const deleteCustomer = (taxId: string) =>
    setCustomers((prev) => prev.filter((c) => c.taxId !== taxId))

  const updateCustomer = (updated: Customer) =>
    setCustomers((prev) =>
      prev.map((c) => (c.taxId === updated.taxId ? updated : c))
    )

  return {
    customers,
    isLoading,
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
