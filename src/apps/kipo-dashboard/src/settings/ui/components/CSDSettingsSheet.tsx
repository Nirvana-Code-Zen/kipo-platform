"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

import { Button, Input, Tooltip } from "@kipo/ui-react"
import { X, CheckCircle2, FileUp, Eye, EyeOff, HelpCircle } from "lucide-react"

import { useUploadCsd } from "../hooks/useUploadCsd"

import type { UIFiscalSettings } from "./types"

interface CSDSettingsSheetProps {
  isOpen: boolean
  onClose: () => void
  onSaved: (data: UIFiscalSettings) => void
}

const CSD_HELP_TEXT =
  "El CSD (Certificado de Sello Digital) es un archivo que el SAT te entrega para firmar tus facturas electrónicamente. Necesitas tu archivo .cer, tu archivo .key y la contraseña de la llave privada, obtenidos desde el portal del SAT."

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13,
        color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em",
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--border-soft)" }} />
    </div>
  )
}

interface FilePickerProps {
  label: string
  accept: string
  file: File | null
  onSelect: (file: File) => void
  error?: string
}

function FilePicker({ label, accept, file, onSelect, error }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: "var(--text-strong)" }}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          width: "100%", textAlign: "left",
          background: "var(--surface-card)",
          border: `1.5px solid ${error ? "var(--kipo-danger)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-md)",
          padding: "12px 14px",
          fontSize: 14,
          fontFamily: "var(--font-body)",
          color: file ? "var(--text-strong)" : "var(--text-muted)",
          cursor: "pointer",
        }}
      >
        <FileUp size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        {file ? file.name : `Seleccionar archivo ${accept}`}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0]
          if (selected) onSelect(selected)
          e.target.value = ""
        }}
      />
      {error && <span style={{ fontSize: 12, color: "var(--kipo-danger)" }}>{error}</span>}
    </div>
  )
}

export function CSDSettingsSheet({ isOpen, onClose, onSaved }: CSDSettingsSheetProps) {
  const { upload, isUploading, error } = useUploadCsd()

  const [cerFile, setCerFile] = useState<File | null>(null)
  const [keyFile, setKeyFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"cer" | "key" | "password", string>>>({})

  useEffect(() => {
    if (isOpen) {
      setCerFile(null)
      setKeyFile(null)
      setPassword("")
      setShowPassword(false)
      setFieldErrors({})
    }
  }, [isOpen])

  if (!isOpen) return null

  function validate(): boolean {
    const next: Partial<Record<"cer" | "key" | "password", string>> = {}
    if (!cerFile || !cerFile.name.toLowerCase().endsWith(".cer")) next.cer = "Selecciona un archivo .cer válido"
    if (!keyFile || !keyFile.name.toLowerCase().endsWith(".key")) next.key = "Selecciona un archivo .key válido"
    if (!password) next.password = "Requerida"
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !cerFile || !keyFile) return
    const result = await upload({ cerFile, keyFile, password })
    if (result) {
      onSaved(result)
      setPassword("")
      onClose()
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[92dvh]">
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <h2 className="font-semibold text-base">Configurar CSD</h2>
              <Tooltip content={CSD_HELP_TEXT}>
                <button type="button" aria-label="¿Qué es un CSD?" style={{ display: "inline-flex", border: "none", background: "none", padding: 0, cursor: "pointer" }}>
                  <HelpCircle size={14} style={{ color: "var(--text-muted)" }} />
                </button>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Certificado de Sello Digital emitido por el SAT
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 border" style={{
            background: "var(--kipo-danger-bg)",
            borderColor: "var(--kipo-danger)",
            color: "var(--kipo-danger)",
            fontFamily: "var(--font-body)",
          }}>
            {error}
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-5 py-5">
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

              <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <SectionTitle>Archivos del certificado</SectionTitle>

                <FilePicker label="Certificado (.cer)" accept=".cer" file={cerFile} onSelect={setCerFile} error={fieldErrors.cer} />
                <FilePicker label="Llave privada (.key)" accept=".key" file={keyFile} onSelect={setKeyFile} error={fieldErrors.key} />

                <Input
                  label="Contraseña de la llave privada"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                  autoComplete="off"
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{ display: "flex", border: "none", background: "none", padding: 0, cursor: "pointer" }}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </section>

              <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                <Button type="button" variant="secondary" size="md" full onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="md" full disabled={isUploading}>
                  <CheckCircle2 size={15} />
                  {isUploading ? "Subiendo..." : "Guardar"}
                </Button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
