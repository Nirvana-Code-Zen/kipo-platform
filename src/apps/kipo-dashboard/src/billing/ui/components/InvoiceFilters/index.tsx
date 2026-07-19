"use client"

import { Search, X } from "lucide-react"

import { STATUS_PILLS } from "./constants"

import type { InvoiceFiltersProps } from "./types"

export function InvoiceFilters({
  statusFilter,
  onStatusChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  searchQuery,
  onSearchQueryChange,
  activeFilterCount,
  onClearAll,
  totalCount,
  filteredCount,
}: InvoiceFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_PILLS.map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => onStatusChange(pill.value)}
              className={`inline-flex items-center px-[14px] py-[5px] rounded-[var(--radius-pill)] text-[13px] font-semibold font-sans cursor-pointer border-[1.5px] transition-all whitespace-nowrap ${
                statusFilter === pill.value
                  ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                  : "bg-muted text-foreground border-border-subtle"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <span className="text-[12px] text-muted-foreground font-sans">
              {filteredCount} de {totalCount}
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--kipo-danger)] font-sans bg-transparent border-0 cursor-pointer px-2 py-1 rounded-sm"
            >
              <X size={12} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-end">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Receptor, RFC, folio o folio fiscal..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full box-border bg-card border-[1.5px] border-input rounded-md px-3 py-2 pl-[34px] text-[13px] font-sans text-foreground outline-none cursor-pointer"
            style={{ paddingRight: searchQuery ? 34 : 12 }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-muted-foreground flex items-center"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-[11px] font-semibold text-muted-foreground font-sans uppercase tracking-[0.05em]">
            Desde
          </label>
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-full box-border bg-card border-[1.5px] border-input rounded-md px-3 py-2 text-[13px] font-sans text-foreground outline-none cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-[11px] font-semibold text-muted-foreground font-sans uppercase tracking-[0.05em]">
            Hasta
          </label>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-full box-border bg-card border-[1.5px] border-input rounded-md px-3 py-2 text-[13px] font-sans text-foreground outline-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
