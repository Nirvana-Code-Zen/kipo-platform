export type CustomerStatus = 'active' | 'inactive'

export const DEFAULT_STATUS: CustomerStatus = 'active'

export const toggleStatus = (status: CustomerStatus): CustomerStatus =>
  status === 'active' ? 'inactive' : 'active'
