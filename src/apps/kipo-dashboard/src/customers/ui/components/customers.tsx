"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

import { Loader2 } from "lucide-react"

import { CustomersListSkeleton } from "@/src/shared/ui/components/dashboard/skeletons"

import { CustomerCard } from "./CustomerCard"
import { CustomerDetailSheet } from "./CustomerDetailSheet"
import { CustomersEmptyState } from "./CustomersEmptyState"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import { EditCustomerSheet } from "./EditCustomerSheet"
import { useCustomerList } from "../hooks/useCustomerList"
import { useDeleteCustomer } from "../hooks/useDeleteCustomer"
import { useEditCustomer } from "../hooks/useEditCustomer"
import { useToggleCustomerStatus } from "../hooks/useToggleCustomerStatus"

import type { Customer } from "./types"

export interface CustomersHandle {
  addCustomer: (customer: Customer) => void
}

export const Customers = forwardRef<CustomersHandle>(function Customers(_, ref) {
  const {
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
  } = useCustomerList()

  const { save: saveEdit } = useEditCustomer(updateCustomer)
  const { remove: removeCustomer } = useDeleteCustomer(deleteCustomer)
  const { toggle: toggleCustomerStatus } = useToggleCustomerStatus(toggleStatus)

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)

  useImperativeHandle(ref, () => ({ addCustomer }))

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) loadMore()
      },
      { rootMargin: "200px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, isFetchingMore, loadMore])

  if (isLoading) return <CustomersListSkeleton />

  if (customers.length === 0) return <CustomersEmptyState />

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <CustomerCard
              key={customer.taxId}
              customer={customer}
              index={index}
              onToggleStatus={() => toggleCustomerStatus(customer.id, customer.status ?? "inactive")}
              onDelete={setCustomerToDelete}
              onViewDetails={setSelectedCustomer}
              onEdit={setEditingCustomer}
            />
          ))}
        </div>

        {hasMore && <div ref={sentinelRef} aria-hidden className="h-px" />}

        {isFetchingMore && (
          <div
            className="flex items-center justify-center gap-2 py-4 font-sans text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <Loader2 size={16} className="animate-spin" />
            Cargando más...
          </div>
        )}
      </div>

      <CustomerDetailSheet
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      <EditCustomerSheet
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSave={saveEdit}
      />

      <DeleteConfirmDialog
        customerName={customerToDelete?.legalName ?? null}
        onConfirm={() => {
          if (customerToDelete) removeCustomer(customerToDelete.id)
          setCustomerToDelete(null)
        }}
        onCancel={() => setCustomerToDelete(null)}
      />
    </>
  )
})
