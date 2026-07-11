"use client"

import { useRef, useState } from "react"

import { Button, Tooltip } from "@kipo/ui-react"
import { Eye, EyeOff, FileUp, HelpCircle } from "lucide-react"

import { AuthInput } from "@/src/auth/ui/components/AuthInput"
import { useUploadCsd } from "@/src/settings/ui/hooks/useUploadCsd"
import { useConfirmManifiesto } from "@/src/settings/ui/hooks/useConfirmManifiesto"

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
  const { confirm, isConfirming, error: confirmError } = useConfirmManifiesto()

  const [cerFile, setCerFile] = useState<File | null>(null)
  const [keyFile, setKeyFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [csdDone, setCsdDone] = useState(false)
  const [manifiestoDone, setManifiestoDone] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleUploadCsd() {
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
    if (result) {
      setCsdDone(true)
      setPassword("")
    }
  }

  async function handleConfirmManifiesto() {
    const result = await confirm()
    if (result) setManifiestoDone(true)
  }

  const displayError = validationError ?? uploadError ?? confirmError

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

        <Button onClick={handleUploadCsd} disabled={isUploading || csdDone} full>
          {csdDone ? "CSD configurado ✓" : isUploading ? "Subiendo..." : "Subir certificado"}
        </Button>

        <div className="mt-8">
          <p className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground font-sans mb-3 uppercase">
            Carta Manifiesto
          </p>
          <iframe
            src="https://www.facturapi.io/embedded/manifiesto"
            className="w-full rounded-xl"
            style={{ height: 360, border: "1px solid var(--border-strong)" }}
            title="Firma de Carta Manifiesto"
          />
          <div className="mt-3">
            <Button onClick={handleConfirmManifiesto} disabled={isConfirming || manifiestoDone} full variant="secondary">
              {manifiestoDone ? "Manifiesto firmado ✓" : isConfirming ? "Confirmando..." : "Ya firmé, marcar como completado"}
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <Button onClick={onFinish} full>
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  )
}
