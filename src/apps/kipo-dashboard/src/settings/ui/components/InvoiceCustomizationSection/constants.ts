import { DEFAULT_DISPLAY_OPTIONS } from "../shared/pdfCustomizationConstants"

import type { UIInvoiceDisplayOptions } from "../shared/types"

export function hasCustomDisplayOptions(displayOptions: UIInvoiceDisplayOptions | undefined): boolean {
  if (!displayOptions) return false
  return (Object.keys(DEFAULT_DISPLAY_OPTIONS) as Array<keyof UIInvoiceDisplayOptions>).some(
    (key) => displayOptions[key] !== DEFAULT_DISPLAY_OPTIONS[key]
  )
}
