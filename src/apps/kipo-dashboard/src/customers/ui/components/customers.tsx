"use client"

import { useState } from "react"

import { CustomerCard } from "./CustomerCard"
import { CustomerDetailSheet } from "./CustomerDetailSheet"

import type { Customer } from "./types"

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

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const handleToggleStatus = (taxId: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.taxId === taxId
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    )
  }

  const handleDelete = (taxId: string) => {
    setCustomers((prev) => prev.filter((c) => c.taxId !== taxId))
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <CustomerCard
              key={customer.taxId}
              customer={customer}
              index={index}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onViewDetails={setSelectedCustomer}
            />
          ))}
        </div>
      </div>

      <CustomerDetailSheet
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </>
  )
}
