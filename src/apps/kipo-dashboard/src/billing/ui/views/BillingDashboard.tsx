'use client'

import { useRef, useState, useEffect } from "react"

import { useSearchParams } from "next/navigation"
import { FilePlus } from "lucide-react"
import { Button } from '@kipo/ui-react'

import { Header } from '@/src/shared/ui/components/dashboard/header'

import { Invoices } from '../components/invoices'
import { CreateInvoiceSheet } from '../components/CreateInvoiceSheet'

import type { InvoicesHandle } from '../components/invoices'
import type { StatusFilter } from '../hooks/useInvoiceFilters'

const VALID_STATUSES: StatusFilter[] = ["all", "stamped", "draft", "cancelled"]

export const BillingDashboard = () => {
  const searchParams = useSearchParams()
  const rawStatus = searchParams.get("status") ?? "all"
  const initialStatus: StatusFilter = (VALID_STATUSES.includes(rawStatus as StatusFilter) ? rawStatus : "all") as StatusFilter

  const [sheetOpen, setSheetOpen] = useState(false)
  const invoicesRef = useRef<InvoicesHandle>(null)

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setSheetOpen(true)
    }
  }, [])

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
        <Invoices ref={invoicesRef} initialStatus={initialStatus} />
      </div>
      <CreateInvoiceSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreated={(invoice) => invoicesRef.current?.addInvoice(invoice)}
      />
    </>
  )
}
