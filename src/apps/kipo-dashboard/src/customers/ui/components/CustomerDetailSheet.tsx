"use client"

import { createPortal } from "react-dom"

import { Avatar, AvatarFallback, AvatarImage, Badge, Button } from "@kipo/ui-react"
import { Mail, Phone, X, FileText, AtSign, PhoneCall, ShieldCheck, User, Building2 } from "lucide-react"

import { detectRfcType, RFC_TYPE_LABEL } from "../hooks/useCustomerForm"

import type { Customer } from "./types"

interface CustomerDetailSheetProps {
  customer: Customer | null
  onClose: () => void
}

export function CustomerDetailSheet({ customer, onClose }: CustomerDetailSheetProps) {
  if (!customer) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
          <h2 className="font-semibold text-base">Datos del cliente</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.legalName} />
              <AvatarFallback>{customer.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg leading-tight">{customer.legalName}</p>
              <div className="mt-1">
                <Badge tone={customer.status === "active" ? "success" : "neutral"}>
                  {customer.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <DetailRow
              icon={<FileText className="w-4 h-4" />}
              label="RFC"
              value={customer.taxId}
              extra={<RfcTypeTag taxId={customer.taxId} />}
            />
            <DetailRow icon={<ShieldCheck className="w-4 h-4" />} label="Régimen fiscal" value={customer.taxRegime} />
            <DetailRow icon={<AtSign className="w-4 h-4" />} label="Correo" value={customer.email} />
            {customer.phone && (
              <DetailRow icon={<PhoneCall className="w-4 h-4" />} label="Teléfono" value={customer.phone} />
            )}
          </div>
        </div>

        <div className="px-5 pb-6 pt-2 flex gap-2">
          <a href={`mailto:${customer.email}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              <Mail className="w-4 h-4 mr-1.5" />
              Email
            </Button>
          </a>
          {customer.phone && (
            <a href={`tel:${customer.phone}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                <Phone className="w-4 h-4 mr-1.5" />
                Llamar
              </Button>
            </a>
          )}
          <Button variant="ghost" size="sm" className="flex-1" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function RfcTypeTag({ taxId }: { taxId: string }) {
  const rfcType = detectRfcType(taxId)
  if (rfcType !== "natural" && rfcType !== "legal") return null

  const Icon = rfcType === "natural" ? User : Building2

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <Icon size={13} style={{ color: "var(--brand)", flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--brand)" }}>
        {RFC_TYPE_LABEL[rfcType]}
      </span>
    </span>
  )
}

function DetailRow({
  icon,
  label,
  value,
  extra,
}: {
  icon: React.ReactNode
  label: string
  value: string
  extra?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium break-all">{value}</p>
        {extra && <div className="mt-1">{extra}</div>}
      </div>
    </div>
  )
}
