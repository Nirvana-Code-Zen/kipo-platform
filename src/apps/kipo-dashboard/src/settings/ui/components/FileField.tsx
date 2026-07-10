import { useRef } from "react"

import { Upload } from "lucide-react"

import { FileFieldProps } from './types'

export function FileField({ label, accept, file, icon, onFileChange }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hasFile = file !== null

  return (
    <div>
      <p
        className="text-xs font-medium mb-1.5"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
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
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer text-left transition-colors duration-150"
        style={{
          background: hasFile ? "color-mix(in srgb, var(--brand) 6%, transparent)" : "var(--surface-card)",
          border: `1.5px ${hasFile ? "solid" : "dashed"} ${hasFile ? "var(--brand)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-md)",
        }}
      >
        <span className="shrink-0" style={{ color: hasFile ? "var(--brand)" : "var(--text-muted)" }}>
          {hasFile ? icon : <Upload size={16} />}
        </span>
        <span
          className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm"
          style={{ color: hasFile ? "var(--text-strong)" : "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
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
            className="text-[11px] cursor-pointer shrink-0 px-0.5 bg-transparent border-0"
            style={{ color: "var(--text-muted)" }}
          >
            Quitar
          </button>
        )}
      </button>
    </div>
  )
}
