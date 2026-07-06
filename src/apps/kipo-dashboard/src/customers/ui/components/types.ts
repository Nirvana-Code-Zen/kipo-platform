export type CustomerStatus = "active" | "inactive"

export interface Customer {
  taxId: string
  email: string
  phone?: string
  status?: CustomerStatus
  legalName: string
  taxRegime: string
  avatar: string
  initials: string
}
