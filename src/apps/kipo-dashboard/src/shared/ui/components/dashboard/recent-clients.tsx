"use client"

import { useRouter } from "next/navigation"
import { Plus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage, Button, Card } from "@kipo/ui-react"

import { RecentClientsSkeleton } from "@/src/shared/ui/components/dashboard/skeletons"
import { useLatestClients } from "@/src/dashboard/ui/hooks/useLatestClients"

function StatusBadge({ status }: { status?: string }) {
  const isActive = status === "active"
  return (
    <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 group-hover:scale-105 ${
      isActive
        ? "bg-success-soft text-success"
        : "bg-surface-muted text-text-muted"
    }`}>
      {isActive ? "Activo" : "Inactivo"}
    </span>
  )
}

function ClientSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3">
      <div className="skeleton w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-32 rounded" />
        <div className="skeleton h-3 w-48 rounded" />
      </div>
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
      <div
        className="flex items-center justify-center"
        style={{
          width: 56, height: 56,
          borderRadius: "var(--radius-lg)",
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <Users size={24} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: "var(--text-strong)" }}>
          Sin clientes aún
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Agrega tu primer cliente para comenzar
        </p>
      </div>
      <button
        onClick={onAdd}
        className="text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
        style={{
          background: "var(--brand)",
          color: "var(--text-on-brand)",
        }}
      >
        Agregar cliente
      </button>
    </div>
  )
}

export function RecentClients() {
  const router = useRouter()
  const { clients, isLoading } = useLatestClients()

  function handleAdd() {
    router.push("/customers?new=1")
  }

  if (isLoading) {
    return (
      <RecentClientsSkeleton />
    )
  }

  return (
    <Card
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up"
      style={{ animationDelay: "600ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Clientes recientes</h2>
        <Button
          variant="ghost"
          size="sm"
          className="transition-all duration-300 hover:scale-105 bg-transparent"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-1">
          {Array.from({ length: 4 }).map((_, i) => <ClientSkeleton key={i} />)}
        </div>
      ) : clients.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
      ) : (
        <div className="space-y-4">
          {clients.map((client, index) => (
            <div
              key={client.taxId}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${650 + index * 100}ms` }}
            >
              <Avatar className="w-12 h-12 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-110">
                {client.avatar && <AvatarImage src={client.avatar} alt={client.legalName} className="object-cover w-full h-full" />}
                <AvatarFallback
                  style={{ background: "var(--surface-brand-soft)", color: "var(--brand)", fontWeight: 700, fontFamily: "var(--font-display)", margin: 'auto' }}
                >
                  {client.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{client.legalName}</p>
                <p className="text-xs text-muted-foreground truncate">{client.email}</p>
              </div>
              <StatusBadge status={client.status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
