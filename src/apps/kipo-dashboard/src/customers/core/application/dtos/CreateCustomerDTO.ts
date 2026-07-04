export type CustomerTypeDTO = 'natural' | 'legal' | 'general' | 'foreign'

export type CreateCustomerDTO = {
  userId: string
  type: CustomerTypeDTO
  rfc: string
  legalName: string
  taxRegime: string   // 3-digit SAT code, e.g. '626'
  zipCode: string     // fiscal address zip code from the CSF
  cfdiUsage: string   // SAT code, e.g. 'G03', 'S01'
}
