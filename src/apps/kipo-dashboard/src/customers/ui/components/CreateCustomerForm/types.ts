import type { Customer } from "../shared/types"

export interface StyledSelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: ReadonlyArray<{ code: string; label: string }>
  error?: string
  placeholder?: string
}

export interface AvatarPickerProps {
  selected: string | null
  initials: string
  onChange: (url: string | null) => void
}

export interface CreateCustomerFormProps {
  onSubmit: (customer: Customer) => void
  onCancel: () => void
  initialValues?: Customer
  submitLabel?: string
}
