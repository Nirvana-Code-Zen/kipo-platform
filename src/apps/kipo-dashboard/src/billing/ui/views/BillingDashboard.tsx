'use client'

import { useRef, useState, useEffect } from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { FilePlus, Palette } from "lucide-react"
import { Button } from '@kipo/ui-react'

import { Header } from '@/src/shared/ui/components/dashboard/header'
import { EmisorMissingBanner } from '@/src/dashboard/ui/components/EmisorMissingBanner'
import { getMissingSetupPath } from '@/src/settings/ui/components/shared/getMissingSetupPath'
import { useEmisorStore } from "@/src/settings/ui/store/emisorStore"

import { CreateInvoiceSheet } from '../components/CreateInvoiceSheet'
import { Invoices } from '../components/invoices'
import { VALID_STATUSES } from './constants'

import type { InvoicesHandle } from '../components/invoices'
import type { StatusFilter } from '../hooks/useInvoiceFilters'

export const BillingDashboard = () => {
  const issuer = useEmisorStore((s) => s.data)
  const isLoaded = useEmisorStore((s) => s.isLoaded)
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawStatus = searchParams.get("status") ?? "all"
  const initialStatus: StatusFilter = (VALID_STATUSES.includes(rawStatus as StatusFilter) ? rawStatus : "all") as StatusFilter

  const [sheetOpen, setSheetOpen] = useState(false)
  const invoicesRef = useRef<InvoicesHandle>(null)

  function openCreateInvoice() {
    if (!isLoaded) return

    const missingPath = getMissingSetupPath(issuer)
    if (missingPath) {
      router.push(missingPath)
      return
    }

    setSheetOpen(true)
  }

  useEffect(() => {
    if (searchParams.get("new") !== "1" || !isLoaded) return
    openCreateInvoice()
  }, [isLoaded])

  return (
    <>
      <Header
        title="Facturación"
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Palette size={15} />}
              onClick={() => router.push('/settings/personalizacion-factura')}
            >
              Personalizar factura
            </Button>
            <Button
              iconLeft={<FilePlus size={15} />}
              size="sm"
              onClick={openCreateInvoice}
            >
              Nueva Factura
            </Button>
          </>
        }
      />
      <EmisorMissingBanner />
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
