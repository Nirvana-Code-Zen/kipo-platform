'use client'

import { useRef, useState } from "react"

import { FilePlus } from "lucide-react"
import { Button } from '@kipo/ui-react'

import { Header } from '@/src/shared/ui/components/dashboard/header'

import { Invoices } from '../components/invoices'
import { CreateInvoiceSheet } from '../components/CreateInvoiceSheet'

import type { InvoicesHandle } from '../components/invoices'

export const BillingDashboard = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const invoicesRef = useRef<InvoicesHandle>(null)

  return (
    <>
      <Header
        title="Facturación"
        actions={
          <Button iconLeft={<FilePlus size={15} />} size="sm" onClick={() => setSheetOpen(true)}>
            Nueva Factura
          </Button>
        }
      />
      <div className="mt-6">
        <Invoices ref={invoicesRef} />
      </div>
      <CreateInvoiceSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={(invoice) => invoicesRef.current?.addInvoice(invoice)}
      />
    </>
  )
}
