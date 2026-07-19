import type { useInvoiceForm } from "../../hooks/useInvoiceForm"
import type { ReceiverSuggestion } from "../../hooks/useReceiverSearch"

export interface StyledSelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: ReadonlyArray<{ code: string; label: string }>
  error?: string
  placeholder?: string
  hint?: string
}

export interface ReceiverSearchProps {
  receiverTaxId: string
  receiverName: string
  receiverZip: string
  isCustomerSelected: boolean
  errorTaxId?: string
  errorName?: string
  errorZip?: string
  onSelectCustomer: (suggestion: ReceiverSuggestion) => void
  onChangeTaxId: (v: string) => void
  onChangeName: (v: string) => void
  onChangeZip: (v: string) => void
  onClear: () => void
}

export interface ProductServiceSearchProps {
  description: string
  productServiceCode: string
  errorDescription?: string
  errorCode?: string
  onChangeDescription: (v: string) => void
  onSelectCode: (code: string) => void
  onClearCode: () => void
}

export interface CreateInvoiceFormProps {
  form: ReturnType<typeof useInvoiceForm>
  onFormSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel?: string
}
