"use client"

import type { StyledSelectProps } from "./types"

export function StyledSelect({ label, value, onChange, options, error, placeholder = "Seleccionar...", hint }: StyledSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-semibold text-[13px] text-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-card rounded-md px-3.5 py-3 pr-10 text-[15px] font-sans cursor-pointer outline-none border-[1.5px] ${
            error ? "border-destructive" : "border-input"
          } ${value ? "text-foreground" : "text-muted-foreground"}`}
        >
          <option value="" disabled className="text-muted-foreground">{placeholder}</option>
          {options.map((o) => (
            <option key={o.code} value={o.code}>{o.label}</option>
          ))}
        </select>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-[12px]">▾</span>
      </div>
      {(error ?? hint) && (
        <span className={`text-[12px] ${error ? "text-destructive" : "text-muted-foreground"}`}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
