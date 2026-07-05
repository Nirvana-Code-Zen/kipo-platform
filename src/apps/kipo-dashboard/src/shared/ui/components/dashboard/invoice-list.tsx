"use client"

import { Plus } from "lucide-react"
import { Button, Card } from "@kipo/ui-react"

const invoices = [
  { name: "Grupo Bimbo SAB de CV", date: "2 jul 2026", color: "bg-blue-500", icon: "🧾" },
  { name: "OXXO SA de CV", date: "1 jul 2026", color: "bg-cyan-500", icon: "📄" },
  { name: "Femsa Comercio SA", date: "30 jun 2026", color: "bg-emerald-500", icon: "✅" },
  { name: "El Palacio de Hierro", date: "28 jun 2026", color: "bg-amber-500", icon: "⏳" },
  { name: "Liverpool SA de CV", date: "26 jun 2026", color: "bg-purple-500", icon: "🧾" },
]

export function InvoiceList() {
  return (
    <Card
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up"
      style={{ animationDelay: "700ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Facturas recientes</h2>
        <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 bg-transparent">
          <Plus className="w-4 h-4 mr-1" />
          Nueva
        </Button>
      </div>
      <div className="space-y-3">
        {invoices.map((invoice, index) => (
          <div
            key={invoice.name}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-all duration-300 cursor-pointer group"
            style={{ animationDelay: `${800 + index * 100}ms` }}
          >
            <div
              className={`${invoice.color} w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}
            >
              {invoice.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{invoice.name}</p>
              <p className="text-xs text-muted-foreground">Timbrada: {invoice.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
