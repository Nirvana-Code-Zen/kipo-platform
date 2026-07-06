'use client'

import { Button } from '@kipo/ui-react'

import { Header } from '@/src/shared/ui/components/dashboard/header'

import { Customers } from '../components/customers'

export function CustomersDashboard () {
  return (
    <>
      <Header
        title="Clientes"
        description="Manega a tus clientes y sus datos fiscales."
        actions={
          <>
            <Button className="w-full sm:w-auto h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105">
                Nuevo Cliente
            </Button>
          </>
        }
      />
      <div className="mt-6">
        <Customers />
      </div>
    </>
  )
}
