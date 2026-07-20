import type { UIFiscalSettings } from "../shared/types"

export interface FiscalSettingsSheetProps {
  isOpen: boolean
  onClose: () => void
  initial: UIFiscalSettings | null
  onSaved: (data: UIFiscalSettings) => void
}
