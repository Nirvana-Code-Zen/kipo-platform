"use client"

export function TotalRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 border-t border-[var(--border-soft)] ${
      bold ? "bg-[var(--surface-brand-soft)]" : "bg-muted"
    }`}>
      <span className={`text-[13px] font-sans ${bold ? "font-bold text-[var(--brand)]" : "font-medium text-foreground"}`}>
        {label}
      </span>
      <span className={`font-mono tracking-[-0.02em] ${
        bold ? "text-[16px] font-bold text-[var(--brand)]" : "text-[13px] font-medium text-foreground"
      }`}>
        {value}
      </span>
    </div>
  )
}
