"use client"

import { useRef } from "react"

import { Upload } from "lucide-react"

import type { FileFieldProps } from "./types"

export function FileField({ label, accept, file, icon, onFileChange }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hasFile = file !== null

  return (
    <div>
      <p className="text-xs font-medium mb-1.5 text-muted-foreground font-sans">
        {label}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer text-left transition-colors duration-150 rounded-md border-[1.5px] ${
          hasFile
            ? "bg-[var(--surface-brand-soft)] border-[var(--brand)]"
            : "bg-card border-dashed border-[var(--border-strong)]"
        }`}
      >
        <span className={`shrink-0 ${hasFile ? "text-[var(--brand)]" : "text-muted-foreground"}`}>
          {hasFile ? icon : <Upload size={16} />}
        </span>
        <span className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-sans ${hasFile ? "text-foreground" : "text-muted-foreground"}`}>
          {hasFile ? file.name : "Ningún archivo seleccionado"}
        </span>
        {hasFile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onFileChange(null)
              if (inputRef.current) inputRef.current.value = ""
            }}
            className="text-[11px] cursor-pointer shrink-0 px-0.5 bg-transparent border-0 text-muted-foreground"
          >
            Quitar
          </button>
        )}
      </button>
    </div>
  )
}
