import type { UIFiscalSettings } from "../shared/types"
import type { EmisorSetupStep } from "../shared/getMissingSetupPath"

export interface CSDSettingsSheetProps {
  isOpen: boolean
  onClose: () => void
  onSaved: (data: UIFiscalSettings) => void
  onContinueToNextStep?: (step: EmisorSetupStep) => void
}

export interface FilePickerProps {
  label: string
  accept: string
  file: File | null
  onSelect: (file: File) => void
  error?: string
  fieldName: string
}
