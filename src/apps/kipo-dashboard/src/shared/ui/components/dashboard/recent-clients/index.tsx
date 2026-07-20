"use client"

import { useRouter } from "next/navigation"
import { Plus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage, Button, Card } from "@kipo/ui-react"

import { RecentClientsSkeleton } from "../skeletons"

import type { RecentClientsProps } from "./types"

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

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
      <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-[var(--bg-subtle)] border border-border-subtle">
        <Users size={24} strokeWidth={1.5} className="text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-sm text-foreground">Sin clientes aún</p>
        <p className="text-xs mt-0.5 text-muted-foreground">Agrega tu primer cliente para comenzar</p>
      </div>
      <button
        onClick={onAdd}
        className="text-xs font-semibold px-4 py-1.5 rounded-full transition-colors bg-[var(--brand)] text-[var(--text-on-brand)]"
      >
        Agregar cliente
      </button>
    </div>
  )
}

export function RecentClients({ clients, isLoading }: RecentClientsProps) {
  const router = useRouter()

  function handleAdd() {
    router.push("/customers?new=1")
  }

  if (isLoading) return <RecentClientsSkeleton />

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

      {clients.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
      ) : (
        <div className="space-y-4">
          {clients.map((client, index) => (
            <div
              key={client.tax_id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${650 + index * 100}ms` }}
            >
              <Avatar className="w-12 h-12 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-110">
                {client.avatar_url && <AvatarImage src={client.avatar_url} alt={client.legal_name} className="object-cover w-full h-full" />}
                <AvatarFallback className="bg-[var(--surface-brand-soft)] text-[var(--brand)] font-bold font-display m-auto">
                  {client.legal_name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{client.legal_name}</p>
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
