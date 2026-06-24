export declare const colors: {
  brand: {
    primary: string
    secondary: string
  }
  neutral: {
    base: string
  }
}

export declare const typography: {
  family: {
    'plus-jakarta': [string, string]
    urbanist: [string, string]
    lato: [string, string]
    inter: [string, string]
    'geist-mono': [string, string]
  }
  weight: {
    regular: number
    medium: number
    semibold: number
    bold: number
  }
  size: Record<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl', string>
  lineHeight: Record<'tight' | 'snug' | 'normal' | 'relaxed' | 'loose', string>
}

export declare const spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl', string>
