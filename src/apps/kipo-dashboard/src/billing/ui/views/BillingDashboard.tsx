'use client'

import { FilePlus } from "lucide-react"
import { Button } from '@kipo/ui-react'

import { Header } from '@/src/shared/ui/components/dashboard/header'

import { Invoices } from '../components/invoices'

export const BillingDashboard = () => {
  return (
    <>
      <Header
        title="Facturación"
        actions={
          <Button iconLeft={<FilePlus size={15} />} size="sm">
            Nueva Factura
          </Button>
        }
      />
      <div className="mt-6">
        <Invoices />
      </div>
    </>
  )
}
