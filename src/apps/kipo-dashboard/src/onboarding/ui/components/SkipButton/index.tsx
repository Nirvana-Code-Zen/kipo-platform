"use client"

import { SkipButtonProps } from "./types"

export function SkipButton({ onClick, children, className = "", wrapperClassName = "text-center mt-4", inline = false, disabled = false }: SkipButtonProps) {
  const btn = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bg-transparent border-0 p-0 text-[13px] text-muted-foreground font-sans underline cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  )

  if (inline) return btn

  return <div className={wrapperClassName}>{btn}</div>
}
