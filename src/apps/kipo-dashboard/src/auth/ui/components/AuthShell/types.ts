import type { ReactNode } from 'react'

export type AuthShellProps = {
  children: ReactNode
}

export interface SlideItem {
  src: string
  alt: string
  tagline: [string, string]
}
