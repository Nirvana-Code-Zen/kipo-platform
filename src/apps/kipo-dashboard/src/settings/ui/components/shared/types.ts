export interface UIFiscalSettings {
  rfc: string
  razonSocial: string
  regimenFiscal: string
  codigoPostal: string
  series: string
  folioSiguiente: number
  csdConfigured?: boolean
  csdConfiguredAt?: string | null
  manifiestoSigned?: boolean
  manifiestoSignedAt?: string | null
  customSectionHtml?: string | null
  displayOptions?: UIInvoiceDisplayOptions
  logoUrl?: string | null
}

export interface UIInvoiceDisplayOptions {
  showCatalogCodes: boolean
  showProductKey: boolean
  showAddressCodes: boolean
  showExportKey: boolean
  roundUnitPrice: boolean
  showTaxBreakdown: boolean
  showIepsBreakdown: boolean
  combineIepsWithSubtotal: boolean
  repeatSignatureEachPage: boolean
}
