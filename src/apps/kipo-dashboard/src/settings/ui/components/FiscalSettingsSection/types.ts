import type { UIFiscalSettings } from "../shared/types"

export interface FiscalSettingsSectionProps {
  data: UIFiscalSettings | null
  isLoading: boolean
  onEdit: () => void
}

export interface DataRowProps {
  label: string
  value: string
}
