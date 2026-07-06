"use client"

import { forwardRef, useImperativeHandle } from "react"

import { CustomersListSkeleton } from "@/src/shared/ui/components/dashboard/skeletons"

import { CustomerCard } from "./CustomerCard"
import { CustomerDetailSheet } from "./CustomerDetailSheet"
import { EditCustomerSheet } from "./EditCustomerSheet"
import { useCustomerList } from "../hooks/useCustomerList"

import type { Customer } from "./types"

export interface CustomersHandle {
  addCustomer: (customer: Customer) => void
}

export const Customers = forwardRef<CustomersHandle>(function Customers(_, ref) {
  const {
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
  } = useCustomerList()

  useImperativeHandle(ref, () => ({ addCustomer }))

  if (isLoading) return <CustomersListSkeleton />

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <CustomerCard
              key={customer.taxId}
              customer={customer}
              index={index}
              onToggleStatus={toggleStatus}
              onDelete={deleteCustomer}
              onViewDetails={setSelectedCustomer}
              onEdit={setEditingCustomer}
            />
          ))}
        </div>
      </div>

      <CustomerDetailSheet
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      <EditCustomerSheet
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSubmit={updateCustomer}
      />
    </>
  )
})
