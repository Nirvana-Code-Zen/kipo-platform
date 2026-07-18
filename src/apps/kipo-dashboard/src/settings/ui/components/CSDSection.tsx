"use client"

import { useState } from "react"

import { FileKey2, FileText, FileSignature } from "lucide-react"
import { Button, Input } from "@kipo/ui-react"

import { FileField } from "./FileField"

export function CSDSection() {
  const [cerFile, setCerFile] = useState<File | null>(null)
  const [keyFile, setKeyFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [showManifesto, setShowManifesto] = useState(false)

  return (
    <div className="overflow-hidden bg-[var(--surface-card)] rounded-[var(--radius-lg)]">
      <div className="px-5 py-4 flex flex-col gap-3.5">
        <FileField
          label="Certificado (.cer)"
          accept=".cer"
          file={cerFile}
          icon={<FileText size={16} />}
          onFileChange={setCerFile}
        />
        <FileField
          label="Llave privada (.key)"
          accept=".key"
          file={keyFile}
          icon={<FileKey2 size={16} />}
          onFileChange={setKeyFile}
        />
        <Input
          label="Contraseña del CSD"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <Button>Enviar CSD</Button>
      </div>

      <div className="pt-3.5 px-5 pb-4">
        <div className={`flex items-center justify-between${showManifesto ? " mb-3.5" : ""}`}>
          <div>
            <p className="text-sm font-semibold m-0 text-[var(--text-strong)] [font-family:var(--font-body)]">
              Firmar manifiesto
            </p>
            <p className="text-xs mt-0.5 text-[var(--text-muted)] [font-family:var(--font-body)]">
              Acepta los términos de uso de FacturAPI
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowManifesto((v) => !v)}
            className="shrink-0"
          >
            <FileSignature size={14} className="mr-1.5" />
            {showManifesto ? "Ocultar" : "Firmar manifiesto"}
          </Button>
        </div>

        {showManifesto && (
          <iframe
            src="https://www.facturapi.io/embedded/manifiesto"
            className="w-full h-[500px] block rounded-[var(--radius-md)]"
            title="Manifiesto FacturAPI"
          />
        )}
      </div>
    </div>
  )
}
