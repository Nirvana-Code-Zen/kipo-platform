"use client"

import { Users } from "lucide-react"

export function CustomersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
      <div
        className="flex items-center justify-center mb-5"
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <Users size={32} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
      </div>

      <h3
        className="font-display text-lg font-semibold"
        style={{ color: "var(--text-strong)" }}
      >
        Sin clientes aún
      </h3>

      <p
        className="font-sans text-sm mt-1.5 max-w-xs"
        style={{ color: "var(--text-muted)" }}
      >
        Agrega tu primer cliente para comenzar a facturar
      </p>
    </div>
  )
}
