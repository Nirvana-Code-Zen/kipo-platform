"use client"

import { Search, X } from "lucide-react"

import type { StatusFilter } from "../hooks/useInvoiceFilters"

interface InvoiceFiltersProps {
  statusFilter: StatusFilter
  onStatusChange: (s: StatusFilter) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
  searchQuery: string
  onSearchQueryChange: (v: string) => void
  activeFilterCount: number
  onClearAll: () => void
  totalCount: number
  filteredCount: number
}

const STATUS_PILLS: { value: StatusFilter; label: string }[] = [
  { value: "all",       label: "Todas" },
  { value: "stamped",   label: "Timbradas" },
  { value: "draft",     label: "Borradores" },
  { value: "cancelled", label: "Canceladas" },
]

const pillBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 14px",
  borderRadius: "var(--radius-pill)",
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "var(--font-body)",
  cursor: "pointer",
  border: "1.5px solid transparent",
  transition: "all var(--dur-fast) var(--ease-out)",
  whiteSpace: "nowrap",
}

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: "var(--brand)",
  color: "#fff",
  borderColor: "var(--brand)",
}

const pillInactive: React.CSSProperties = {
  ...pillBase,
  background: "var(--surface-muted)",
  color: "var(--text-body)",
  borderColor: "var(--border-soft)",
}

const dateInput: React.CSSProperties = {
  background: "var(--surface-card)",
  border: "1.5px solid var(--border-strong)",
  borderRadius: "var(--radius-md)",
  padding: "8px 12px",
  fontSize: 13,
  fontFamily: "var(--font-body)",
  color: "var(--text-strong)",
  outline: "none",
  cursor: "pointer",
  width: "100%",
  boxSizing: "border-box" as const,
}

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
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {STATUS_PILLS.map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => onStatusChange(pill.value)}
              style={statusFilter === pill.value ? pillActive : pillInactive}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {activeFilterCount > 0 && (
            <span style={{
              fontSize: 12, color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}>
              {filteredCount} de {totalCount}
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 600, color: "var(--kipo-danger)",
                fontFamily: "var(--font-body)",
                background: "transparent", border: "none", cursor: "pointer",
                padding: "4px 8px", borderRadius: "var(--radius-sm)",
              }}
            >
              <X size={12} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "end" }}>

        <div style={{ position: "relative" }}>
          <Search size={14} style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--text-muted)", pointerEvents: "none",
          }} />
          <input
            type="text"
            placeholder="Receptor, RFC, folio o folio fiscal..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            style={{
              ...dateInput,
              paddingLeft: 34,
              paddingRight: searchQuery ? 34 : 12,
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange("")}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--text-muted)", display: "flex", alignItems: "center",
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 130 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Desde
          </label>
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => onDateFromChange(e.target.value)}
            style={dateInput}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 130 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Hasta
          </label>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => onDateToChange(e.target.value)}
            style={dateInput}
          />
        </div>
      </div>

    </div>
  )
}
