"use client"

import { useRef, useState } from "react"

import { Button, Tooltip } from "@kipo/ui-react"
import { Eye, EyeOff, FileUp, HelpCircle } from "lucide-react"

import { AuthInput } from "@/src/auth/ui/components/AuthInput"
import { useUploadCsd } from "@/src/settings/ui/hooks/useUploadCsd"

import { ManifiestoSignPortal } from "./ManifiestoSignPortal"

interface CsdStepProps {
  onFinish: () => void
}

const CSD_HELP_TEXT =
  "El CSD (Certificado de Sello Digital) es un archivo que el SAT te entrega para firmar tus facturas electrónicamente. Necesitas tu archivo .cer, tu archivo .key y la contraseña de la llave privada, obtenidas desde el portal del SAT."

interface FilePickerProps {
  label: string
  accept: string
  file: File | null
  onSelect: (file: File) => void
}

function FilePicker({ label, accept, file, onSelect }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-muted-foreground font-sans">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 bg-muted border-transparent rounded-[14px] px-4 py-3.5 text-sm font-sans text-left w-full cursor-pointer"
        style={{ borderWidth: "1.5px", borderStyle: "solid", color: file ? "var(--text-strong)" : "var(--text-muted)" }}
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
    </div>
  )
}

export function CsdStep({ onFinish }: CsdStepProps) {
  const { upload, isUploading, error: uploadError } = useUploadCsd()

  const [cerFile, setCerFile] = useState<File | null>(null)
  const [keyFile, setKeyFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [manifiestoDone, setManifiestoDone] = useState(false)
  const [manifiestoPortalOpen, setManifiestoPortalOpen] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleContinue() {
    if (!cerFile || !cerFile.name.toLowerCase().endsWith(".cer")) {
      setValidationError("Selecciona un archivo .cer válido.")
      return
    }
    if (!keyFile || !keyFile.name.toLowerCase().endsWith(".key")) {
      setValidationError("Selecciona un archivo .key válido.")
      return
    }
    if (!password) {
      setValidationError("Escribe la contraseña de la llave privada.")
      return
    }
    setValidationError(null)
    const result = await upload({ cerFile, keyFile, password })
    if (result) onFinish()
  }

  const displayError = validationError ?? uploadError

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4 py-6">
      <div className="w-full max-w-[480px]">
        <p className="text-[13px] text-primary font-sans font-semibold mb-2">Un paso más · opcional</p>
        <h1 className="font-display font-bold text-[32px] text-foreground tracking-[-0.03em] leading-[1.15] mb-2.5">
          Configura tu certificado digital
        </h1>
        <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-8">
          Podrás configurarlo en cualquier momento desde Ajustes.
        </p>

        {displayError && (
          <div
            className="bg-danger-soft border-destructive rounded-xl px-3.5 py-2.5 text-[13px] text-destructive font-sans mb-5"
            style={{ borderWidth: "1.5px", borderStyle: "solid" }}
          >
            {displayError}
          </div>
        )}

        <div className="flex items-center gap-1.5 mb-3">
          <p className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground font-sans uppercase m-0">
            Certificado (CSD)
          </p>
          <Tooltip content={CSD_HELP_TEXT}>
            <button type="button" aria-label="¿Qué es un CSD?" className="border-0 bg-transparent p-0 cursor-pointer flex">
              <HelpCircle size={13} style={{ color: "var(--text-muted)" }} />
            </button>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          <FilePicker label="Certificado (.cer)" accept=".cer" file={cerFile} onSelect={setCerFile} />
          <FilePicker label="Llave privada (.key)" accept=".key" file={keyFile} onSelect={setKeyFile} />

          <AuthInput
            label="Contraseña de la llave privada"
            showLabel
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="border-0 bg-transparent p-0 cursor-pointer flex"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
        </div>

        <div className="mt-8 mb-4">
          <p className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground font-sans mb-3 uppercase">
            Carta Manifiesto
          </p>
          <div className="flex items-center justify-between gap-3 bg-muted rounded-xl px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground font-sans">
                {manifiestoDone ? "Manifiesto firmado ✓" : "Aún no la has firmado"}
              </p>
              <p className="text-xs text-muted-foreground font-sans mt-0.5">
                Firma con tu e.firma (FIEL) desde el portal de Facturapi.
              </p>
            </div>
            {!manifiestoDone && (
              <Button variant="secondary" size="sm" onClick={() => setManifiestoPortalOpen(true)}>
                Firmar
              </Button>
            )}
          </div>
        </div>

        <Button onClick={handleContinue} disabled={isUploading} full>
          {isUploading ? "Subiendo..." : "Continuar →"}
        </Button>

        <div className="text-center mt-4">
          <button
            onClick={onFinish}
            className="bg-transparent border-0 p-0 text-[13px] text-muted-foreground font-sans underline cursor-pointer"
          >
            Omitir por ahora
          </button>
        </div>
      </div>

      <ManifiestoSignPortal
        isOpen={manifiestoPortalOpen}
        onClose={() => setManifiestoPortalOpen(false)}
        onSigned={() => {
          setManifiestoDone(true)
          setManifiestoPortalOpen(false)
        }}
      />
    </div>
  )
}
