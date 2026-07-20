"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import { useEmisorStore } from "../store/emisorStore"
import { mapFromApi, type EmisorApiResponse } from "./useEmisorInit"

import type { UIFiscalSettings, UIInvoiceDisplayOptions } from "../components/shared/types"

interface SaveInvoiceCustomizationParams {
  customSectionHtml: string | null
  displayOptions: UIInvoiceDisplayOptions
}

export function useSaveInvoiceCustomization() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save({ customSectionHtml, displayOptions }: SaveInvoiceCustomizationParams): Promise<UIFiscalSettings | null> {
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/emisor/pdf-customization`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify({
          custom_section_html: customSectionHtml,
          display_options: {
            show_catalog_codes: displayOptions.showCatalogCodes,
            show_product_key: displayOptions.showProductKey,
            show_address_codes: displayOptions.showAddressCodes,
            show_export_key: displayOptions.showExportKey,
            round_unit_price: displayOptions.roundUnitPrice,
            show_tax_breakdown: displayOptions.showTaxBreakdown,
            show_ieps_breakdown: displayOptions.showIepsBreakdown,
            combine_ieps_with_subtotal: displayOptions.combineIepsWithSubtotal,
            repeat_signature_each_page: displayOptions.repeatSignatureEachPage,
          },
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
        setError(body.error ?? `Error ${res.status}`)
        return null
      }
      const raw = (await res.json()) as EmisorApiResponse
      const result = mapFromApi(raw)
      useEmisorStore.getState().setData(result)
      return result
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de red")
      return null
    } finally {
      setIsSaving(false)
    }
  }

  return { save, isSaving, error }
}
