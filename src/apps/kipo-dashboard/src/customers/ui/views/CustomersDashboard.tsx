'use client'

import { useRef, useState } from 'react'

import { Button } from '@kipo/ui-react'
import { UserPlus } from 'lucide-react'

import { Header } from '@/src/shared/ui/components/dashboard/header'

import { Customers, type CustomersHandle } from '../components/customers'
import { CreateCustomerSheet } from '../components/CreateCustomerSheet'

export function CustomersDashboard() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const customersRef = useRef<CustomersHandle>(null)

  return (
    <>
      <Header
        title="Clientes"
        description="Maneja a tus clientes y sus datos fiscales."
        actions={
          <Button
            iconLeft={<UserPlus size={15} />}
            size="sm"
            onClick={() => setSheetOpen(true)}
          >
            Nuevo Cliente
          </Button>
        }
      />

      <div className="mt-6">
        <Customers ref={customersRef} />
      </div>

      <CreateCustomerSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={(customer) => customersRef.current?.addCustomer(customer)}
      />
    </>
  )
}
