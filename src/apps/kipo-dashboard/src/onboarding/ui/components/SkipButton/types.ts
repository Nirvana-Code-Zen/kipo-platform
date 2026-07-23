export type SkipButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
  className?: string
  wrapperClassName?: string
  inline?: boolean
  disabled?: boolean
}