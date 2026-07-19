"use client"

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-sans font-bold text-[13px] text-muted-foreground uppercase tracking-[0.06em]">
        {children}
      </span>
      <div className="flex-1 h-px bg-[var(--border-soft)]" />
    </div>
  )
}
