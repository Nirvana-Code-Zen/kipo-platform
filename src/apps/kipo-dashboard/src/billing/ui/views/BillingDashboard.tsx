'use client'

import { Button } from '@kipo/ui-react'

import { Header } from '@/src/shared/ui/components/dashboard/header'

export const BillingDashboard = () => {
  return (
    <Header
        title="Facturacion"
        description="Plan, prioritize, and accomplish your tasks with ease."
        actions={
          <>
            <Button className="w-full sm:w-auto h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105">
                + Nueva Factura
            </Button>
          </>
      }
    />
  )
}
