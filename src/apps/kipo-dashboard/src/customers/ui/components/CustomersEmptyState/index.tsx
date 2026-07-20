"use client"

import { Users } from "lucide-react"

export function CustomersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
      <div className="flex items-center justify-center mb-5 w-[72px] h-[72px] rounded-lg bg-card border border-border-subtle">
        <Users size={32} strokeWidth={1.5} className="text-muted-foreground" />
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground">
        Sin clientes aún
      </h3>

      <p className="font-sans text-sm mt-1.5 max-w-xs text-muted-foreground">
        Agrega tu primer cliente para comenzar a facturar
      </p>
    </div>
  )
}
