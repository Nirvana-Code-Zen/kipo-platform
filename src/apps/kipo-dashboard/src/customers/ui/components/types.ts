export type CustomerStatus = "active" | "inactive"

export interface Customer {
  id: string
  taxId: string
  email: string
  phone?: string
  status?: CustomerStatus
  legalName: string
  taxRegime: string
  taxRegimeCode?: string
  zipCode?: string
  cfdiUsage?: string
  avatar: string
  initials: string
}
