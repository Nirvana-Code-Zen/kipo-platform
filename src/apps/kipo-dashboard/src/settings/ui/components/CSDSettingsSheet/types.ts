import type { UIFiscalSettings } from "../shared/types"

export interface CSDSettingsSheetProps {
  isOpen: boolean
  onClose: () => void
  onSaved: (data: UIFiscalSettings) => void
}

export interface FilePickerProps {
  label: string
  accept: string
  file: File | null
  onSelect: (file: File) => void
  error?: string
}
