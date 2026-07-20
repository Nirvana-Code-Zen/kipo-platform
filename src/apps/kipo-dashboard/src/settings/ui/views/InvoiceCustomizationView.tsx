"use client"

import { useState, useEffect, useMemo, useRef } from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button, Card, Switch } from "@kipo/ui-react"
import { ArrowLeft, CheckCircle2, ImageUp } from "lucide-react"

import { Header } from "@/src/shared/ui/components/dashboard/header"

import { useFiscalSettings } from "../hooks/useFiscalSettings"
import { useSaveInvoiceCustomization } from "../hooks/useSaveInvoiceCustomization"
import { useUploadLogo } from "../hooks/useUploadLogo"
import { InvoiceCustomizationPreview } from "../components/InvoiceCustomizationPreview"
import { DEFAULT_DISPLAY_OPTIONS } from "../components/shared/pdfCustomizationConstants"
import { plainTextToHtml, htmlToPlainText } from "../components/shared/plainTextToHtml"

import type { UIInvoiceDisplayOptions } from "../components/shared/types"

const DISPLAY_OPTION_LABELS: Record<keyof UIInvoiceDisplayOptions, string> = {
  showCatalogCodes: "Mostrar claves de catálogo",
  showProductKey: "Mostrar clave de producto/servicio",
  showAddressCodes: "Mostrar claves de dirección",
  showExportKey: "Mostrar clave de exportación",
  roundUnitPrice: "Redondear precio unitario",
  showTaxBreakdown: "Mostrar desglose de impuestos",
  showIepsBreakdown: "Mostrar desglose de IEPS",
  combineIepsWithSubtotal: "Combinar IEPS con subtotal",
  repeatSignatureEachPage: "Repetir sello en cada página",
}

const DISPLAY_OPTION_ORDER: Array<keyof UIInvoiceDisplayOptions> = [
  "showCatalogCodes",
  "showProductKey",
  "showAddressCodes",
  "showExportKey",
  "roundUnitPrice",
  "showTaxBreakdown",
  "showIepsBreakdown",
  "combineIepsWithSubtotal",
  "repeatSignatureEachPage",
]

type MobileTab = "editar" | "preview"

export function InvoiceCustomizationView() {
  const router = useRouter()
  const { data: fiscalData, setData: setFiscalData } = useFiscalSettings()
  const { save, isSaving, error } = useSaveInvoiceCustomization()
  const { upload: uploadLogo, isUploading: isUploadingLogo, error: logoError } = useUploadLogo()

  const [customText, setCustomText] = useState("")
  const [displayOptions, setDisplayOptions] = useState<UIInvoiceDisplayOptions>(DEFAULT_DISPLAY_OPTIONS)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<MobileTab>("editar")

  const logoInputRef = useRef<HTMLInputElement>(null)

  const customSectionHtml = useMemo(() => plainTextToHtml(customText), [customText])

  useEffect(() => {
    setCustomText(htmlToPlainText(fiscalData?.customSectionHtml ?? ""))
    setDisplayOptions(fiscalData?.displayOptions ?? DEFAULT_DISPLAY_OPTIONS)
    setLogoUrl(fiscalData?.logoUrl ?? null)
  }, [])

  function updateDisplayOption(key: keyof UIInvoiceDisplayOptions, value: boolean) {
    setDisplayOptions((prev) => ({ ...prev, [key]: value }))
  }

  function goBackToSettings() {
    router.push("/settings")
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    const result = await uploadLogo(file)
    if (result) setLogoUrl(result.logoUrl ?? null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = await save({ customSectionHtml: customSectionHtml || null, displayOptions })
    if (result) {
      setFiscalData(result)
      goBackToSettings()
    }
  }

  return (
    <>
      <button
        onClick={goBackToSettings}
        className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a Ajustes
      </button>

      <Header
        title="Personalización de factura"
        description="Agrega un logo, texto adicional y ajusta qué información se muestra en el PDF."
      />

      {error && (
        <div className="mt-4 px-3.5 py-2.5 rounded-md text-[13px] border border-destructive bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5">
        <div className="lg:hidden flex gap-1 p-1 bg-muted rounded-lg mb-4">
          <button
            type="button"
            onClick={() => setMobileTab("editar")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mobileTab === "editar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mobileTab === "preview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Vista previa
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-start">
          <Card className={`p-5 md:p-6 flex flex-col gap-6 ${mobileTab === "editar" ? "block" : "hidden"} lg:block`}>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-foreground">
                Logo de tu empresa
              </label>
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <>
                    <Image
                      src={logoUrl}
                      width={16}
                      height={16}
                      alt="Logo de la empresa"
                      className="h-16 w-16 object-contain rounded-md border border-border-subtle bg-muted/30"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isUploadingLogo}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <ImageUp size={14} />
                      {isUploadingLogo ? "Subiendo..." : "Cambiar logo"}
                    </Button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={isUploadingLogo}
                    onClick={() => logoInputRef.current?.click()}
                    className="flex h-16 w-full items-center justify-center gap-2 rounded-md border border-dashed border-border-strong text-[13px] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-60"
                  >
                    <ImageUp size={16} />
                    {isUploadingLogo ? "Subiendo..." : "Subir logo"}
                  </button>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                PNG, JPG o WEBP, máximo 5MB. Aparecerá en la parte superior de tus facturas en PDF.
              </p>
              {logoError && <p className="text-xs text-destructive">{logoError}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-foreground">
                Texto adicional para tus facturas
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={8}
                placeholder="Ej. Gracias por tu preferencia. Para dudas sobre esta factura, escríbenos a facturacion@tuempresa.com."
                className="w-full rounded-md border border-border-subtle bg-card px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-strong resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Este texto se agregará al final de tus facturas en PDF, tal como lo escribas aquí.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[13px] font-semibold text-foreground">Opciones de visualización</p>
              <div className="flex flex-col gap-3">
                {DISPLAY_OPTION_ORDER.map((key) => (
                  <Switch
                    key={key}
                    checked={displayOptions[key]}
                    onChange={(next) => updateDisplayOption(key, next)}
                    label={DISPLAY_OPTION_LABELS[key]}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <Button type="button" variant="secondary" size="md" full onClick={goBackToSettings}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="md" full disabled={isSaving}>
                <CheckCircle2 size={15} />
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </Card>

          <div className={`flex flex-col gap-3 ${mobileTab === "preview" ? "block" : "hidden"} lg:block`}>
            <p className="text-[13px] font-semibold text-foreground">Vista previa</p>
            <InvoiceCustomizationPreview
              logoUrl={logoUrl}
              customSectionHtml={customSectionHtml}
              displayOptions={displayOptions}
            />
          </div>
        </div>
      </form>
    </>
  )
}
