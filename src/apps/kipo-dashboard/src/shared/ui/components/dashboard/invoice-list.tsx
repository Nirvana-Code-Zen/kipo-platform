"use client"

import { useRouter } from "next/navigation"
import { CheckCircle2, Clock, FileText, Plus, XCircle } from "lucide-react"
import { Button, Card } from "@kipo/ui-react"

import type { RecentInvoice } from "@/src/dashboard/ui/hooks/useDashboardSummary"

const statusStyles: Record<string, { color: string; icon: typeof FileText }> = {
  stamped: { color: "bg-emerald-500", icon: CheckCircle2 },
  draft: { color: "bg-blue-500", icon: Clock },
  cancelled: { color: "bg-red-500", icon: XCircle },
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })

export function InvoiceList({ invoices }: { invoices: RecentInvoice[] }) {
  const router = useRouter()

  return (
    <Card
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up"
      style={{ animationDelay: "700ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Facturas recientes</h2>
        <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 bg-transparent" onClick={() => router.push("/billing?new=1")}>
          <Plus className="w-4 h-4 mr-1" />
          Nueva
        </Button>
      </div>
      {invoices.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">Sin facturas recientes</p>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice, index) => {
            const style = statusStyles[invoice.status] ?? statusStyles.draft
            const Icon = style.icon
            return (
              <div
                key={invoice.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <div
                  className={`${style.color} w-10 h-10 rounded-lg flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{invoice.receiver_name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(invoice.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
