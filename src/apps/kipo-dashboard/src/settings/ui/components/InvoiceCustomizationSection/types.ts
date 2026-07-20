import type { UIFiscalSettings } from "../shared/types"

export interface InvoiceCustomizationSectionProps {
  data: UIFiscalSettings | null
  onEdit: () => void
}
