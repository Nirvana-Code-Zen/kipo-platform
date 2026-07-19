"use client"

import { useRef } from "react"

import { Search, X, User } from "lucide-react"
import { Input } from "@kipo/ui-react"

import { useClickOutside } from "@/src/shared/ui/hooks/useClickOutside"

import { useReceiverSearch } from "../../hooks/useReceiverSearch"

import type { ReceiverSearchProps } from "./types"

export function ReceiverSearch({
  receiverTaxId,
  receiverName,
  receiverZip,
  isCustomerSelected,
  errorTaxId,
  errorName,
  errorZip,
  onSelectCustomer,
  onChangeTaxId,
  onChangeName,
  onChangeZip,
  onClear,
}: ReceiverSearchProps) {
  const search = useReceiverSearch()
  const dropdownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropdownRef, () => search.setIsOpen(false))

  if (isCustomerSelected) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-md border-[1.5px] border-input bg-muted">
        <div className="w-9 h-9 rounded-full bg-[var(--surface-brand-soft)] flex items-center justify-center shrink-0">
          <User size={16} className="text-[var(--brand)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-foreground leading-snug">
            {receiverName}
          </p>
          <p className="font-mono text-[12px] text-muted-foreground mt-0.5">
            {receiverTaxId}{receiverZip ? ` · CP ${receiverZip}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => { onClear(); search.clear() }}
          className="flex items-center justify-center w-7 h-7 rounded-sm bg-transparent border-0 cursor-pointer text-muted-foreground"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  const showNoResults = search.isOpen && search.query.trim().length >= 2 && search.suggestions.length === 0

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-semibold text-[13px] text-foreground">
        Buscar Cliente
      </label>
      <div ref={dropdownRef} className="relative">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Nombre o RFC del cliente..."
            value={search.query}
            onChange={(e) => {
              search.setQuery(e.target.value)
              search.setIsOpen(true)
            }}
            onFocus={() => search.setIsOpen(true)}
            className="w-full box-border bg-card border-[1.5px] border-input rounded-md py-3 pl-10 pr-3.5 text-[15px] font-sans text-foreground outline-none"
          />
        </div>

        {search.isOpen && search.suggestions.length > 0 && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 overflow-hidden rounded-md border-[1.5px] border-input bg-card shadow-lg">
            {search.suggestions.map((s) => (
              <button
                key={s.taxId}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  onSelectCustomer(s)
                  search.clear()
                }}
                className="flex items-center gap-3 w-full px-3.5 py-2.5 bg-transparent border-0 border-b border-border-subtle cursor-pointer text-left hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--surface-brand-soft)] flex items-center justify-center shrink-0">
                  <User size={14} className="text-[var(--brand)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-foreground leading-snug">
                    {s.name}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                    {s.taxId}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {showNoResults && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-md border-[1.5px] border-input bg-card shadow-lg px-3.5 py-3">
            <p className="text-[13px] text-muted-foreground">
              No se encontraron clientes. Llena los datos manualmente o crea el cliente primero.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <Input
          label="RFC"
          placeholder="XAXX010101000"
          value={receiverTaxId}
          onChange={(e) => onChangeTaxId(e.target.value.toUpperCase())}
          error={errorTaxId}
          mono
          maxLength={13}
          autoComplete="off"
        />
        <Input
          label="Nombre / Razón social"
          placeholder="Como en la CSF"
          value={receiverName}
          onChange={(e) => onChangeName(e.target.value)}
          error={errorName}
          autoComplete="off"
        />
        <Input
          label="C.P. Receptor"
          placeholder="00000"
          value={receiverZip}
          onChange={(e) => onChangeZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          error={errorZip}
          mono
          maxLength={5}
        />
      </div>
    </div>
  )
}
