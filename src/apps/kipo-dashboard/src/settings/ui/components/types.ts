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
}
