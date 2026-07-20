import type { UIFiscalSettings } from "../shared/types"

export interface CSDSettingsSectionProps {
  data: UIFiscalSettings | null
  isLoading: boolean
  onEdit: () => void
}
