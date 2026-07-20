export interface CsdStepProps {
  onFinish: () => void
}

export interface FilePickerProps {
  label: string
  accept: string
  file: File | null
  onSelect: (file: File) => void
}
