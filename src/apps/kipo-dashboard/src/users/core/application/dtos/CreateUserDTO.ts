export type PersonTypeDTO = 'natural' | 'legal' | 'foreign'

export type CreateUserDTO = {
  type: PersonTypeDTO
  rfc: string
  legalName: string
  taxRegime: string  // 3-digit SAT code, e.g. '626'
  zipCode: string
}
