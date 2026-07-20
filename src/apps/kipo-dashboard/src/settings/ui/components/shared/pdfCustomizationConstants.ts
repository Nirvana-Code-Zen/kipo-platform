import type { UIInvoiceDisplayOptions } from './types'

// Keep in sync with backend: src/apps/kipo-platform/emisor/pdf_customization_constants.py
export const PDF_CUSTOM_SECTION_ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'p', 'span', 'small', 'br',
  'b', 'i', 'ul', 'ol', 'li', 'strong', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
] as const

export const DEFAULT_DISPLAY_OPTIONS: UIInvoiceDisplayOptions = {
  showCatalogCodes: true,
  showProductKey: true,
  showAddressCodes: true,
  showExportKey: false,
  roundUnitPrice: false,
  showTaxBreakdown: true,
  showIepsBreakdown: true,
  combineIepsWithSubtotal: false,
  repeatSignatureEachPage: false,
}
