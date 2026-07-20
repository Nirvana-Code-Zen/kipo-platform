export type CustomerTypeDTO = 'natural' | 'legal' | 'general' | 'foreign'

export type CreateCustomerDTO = {
  userId: string
  type: CustomerTypeDTO
  rfc: string
  legalName: string
  taxRegime: string
  zipCode: string
  cfdiUsage: string
}
