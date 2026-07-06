"use client"

import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card } from "@kipo/ui-react"
import { Mail, MoreHorizontal } from "lucide-react"

import { CustomerCardMenu } from "./CustomerCardMenu"

import type { Customer } from "./types"

interface CustomerCardProps {
  customer: Customer
  index: number
  onToggleStatus: (taxId: string) => void
  onDelete: (taxId: string) => void
  onViewDetails: (customer: Customer) => void
}

export function CustomerCard({ customer, index, onToggleStatus, onDelete, onViewDetails }: CustomerCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Card
      className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <Avatar className="w-16 h-16 border-2 border-primary/20">
          <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.legalName} />
          <AvatarFallback>{customer.initials}</AvatarFallback>
        </Avatar>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={menuOpen ? "bg-muted" : ""}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <CustomerCardMenu
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            status={customer.status ?? "inactive"}
            onViewDetails={() => onViewDetails(customer)}
            onToggleStatus={() => onToggleStatus(customer.taxId)}
            onDelete={() => onDelete(customer.taxId)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{customer.legalName}</h3>
          <p className="text-sm text-muted-foreground">{customer.taxRegime}</p>
        </div>

        <Badge tone={customer.status === "active" ? "success" : "neutral"}>
          {customer.status === "active" ? "Activo" : "Inactivo"}
        </Badge>

        <div className="flex gap-2 pt-2">
          <a href={`mailto:${customer.email}`} className="flex-1">
            <Button variant="primary" size="md" className="w-full bg-transparent">
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
          </a>
        </div>
      </div>
    </Card>
  )
}
