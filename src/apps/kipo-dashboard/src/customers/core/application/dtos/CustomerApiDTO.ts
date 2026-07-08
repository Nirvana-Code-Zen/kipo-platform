export type CustomerCreateRequest = {
  tax_id: string
  legal_name: string
  tax_regime: string
  zip: string
  cfdi_use: string
  email: string
  avatar_url: string | null
}

export type CustomerUpdateRequest = {
  tax_id: string
  legal_name: string
  tax_regime: string
  zip: string
  cfdi_use: string
  email: string
  avatar_url: string | null
}

export type CustomerApiResponse = {
  id: string
  tax_id: string
  legal_name: string
  tax_regime: string
  zip: string
  cfdi_use: string
  email: string
  is_active: boolean
  avatar_url: string | null
}
