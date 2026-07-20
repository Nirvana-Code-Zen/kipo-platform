export interface FileFieldProps {
  label: string
  accept: string
  file: File | null
  icon: React.ReactNode
  onFileChange: (file: File | null) => void
}
