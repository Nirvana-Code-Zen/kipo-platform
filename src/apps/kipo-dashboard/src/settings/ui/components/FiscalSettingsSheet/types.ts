import type { UIFiscalSettings } from "../shared/types"
import type { EmisorSetupStep } from "../shared/getMissingSetupPath"

export interface FiscalSettingsSheetProps {
  isOpen: boolean
  onClose: () => void
  initial: UIFiscalSettings | null
  onSaved: (data: UIFiscalSettings) => void
  onContinueToNextStep?: (step: EmisorSetupStep) => void
}
