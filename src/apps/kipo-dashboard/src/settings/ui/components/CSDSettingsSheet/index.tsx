"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

import { Button, Input, Tooltip } from "@kipo/ui-react"
import { X, CheckCircle2, FileUp, Eye, EyeOff, HelpCircle } from "lucide-react"

import { useUploadCsd } from "../../hooks/useUploadCsd"
import { CSD_HELP_TEXT } from "./constants"

import type { CSDSettingsSheetProps, FilePickerProps } from "./types"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-sans font-bold text-[13px] text-muted-foreground uppercase tracking-[0.06em]">
        {children}
      </span>
      <div className="flex-1 h-px bg-[var(--border-soft)]" />
    </div>
  )
}

function FilePicker({ label, accept, file, onSelect, error }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-semibold text-[13px] text-foreground">
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex items-center gap-2 w-full text-left bg-card rounded-md px-3.5 py-3 text-[14px] font-sans cursor-pointer border-[1.5px] ${
          error ? "border-[var(--kipo-danger)]" : "border-[var(--border-strong)]"
        } ${file ? "text-foreground" : "text-muted-foreground"}`}
      >
        <FileUp size={15} className="text-muted-foreground shrink-0" />
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
      {error && <span className="text-xs text-[var(--kipo-danger)]">{error}</span>}
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
            <div className="flex items-center gap-1.5">
              <h2 className="font-semibold text-base">Configurar CSD</h2>
              <Tooltip content={CSD_HELP_TEXT}>
                <button type="button" aria-label="¿Qué es un CSD?" className="inline-flex border-0 bg-transparent p-0 cursor-pointer">
                  <HelpCircle size={14} className="text-muted-foreground" />
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
          <div className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 border bg-[var(--kipo-danger-bg)] border-[var(--kipo-danger)] text-[var(--kipo-danger)] font-sans">
            {error}
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-5 py-5">
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-7">

              <section className="flex flex-col gap-4">
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
                      className="flex border-0 bg-transparent p-0 cursor-pointer"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </section>

              <div className="flex gap-2.5 pt-1">
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
