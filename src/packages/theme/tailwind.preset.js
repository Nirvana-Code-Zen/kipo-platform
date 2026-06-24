'use strict'

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Semantic aliases (CSS variables — adapt to light/dark theme)
        'bg-base':        'var(--bg-base)',
        'bg-subtle':      'var(--bg-subtle)',
        'surface-card':   'var(--surface-card)',
        'surface-raised': 'var(--surface-raised)',
        'surface-sunken': 'var(--surface-sunken)',
        'text-strong':    'var(--text-strong)',
        'text-body':      'var(--text-body)',
        'text-muted':     'var(--text-muted)',
        'text-on-brand':  'var(--text-on-brand)',
        'text-on-accent': 'var(--text-on-accent)',
        'border-subtle':  'var(--border-subtle)',
        'border-strong':  'var(--border-strong)',
        brand:            'var(--brand)',
        'brand-strong':   'var(--brand-strong)',
        accent:           'var(--accent)',
        'accent-strong':  'var(--accent-strong)',
        // Static palette
        kipo: {
          red:     '#CE0D2F',
          'red-dark': '#9F0824',
          lime:    '#C6F542',
          success: '#16A34A',
          warning: '#CA8A04',
          danger:  '#9F0824',
          info:    '#7C3AED',
        },
      },
      fontFamily: {
        display:       ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body:          ['"Inter"', 'system-ui', 'sans-serif'],
        mono:          ['"Geist Mono"', 'ui-monospace', '"SF Mono"', 'monospace'],
        // Legacy aliases
        'plus-jakarta': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        urbanist:      ['"Urbanist"', 'system-ui', 'sans-serif'],
        lato:          ['"Lato"', 'system-ui', 'sans-serif'],
        inter:         ['"Inter"', 'system-ui', 'sans-serif'],
        'geist-mono':  ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'kipo-xs':   '6px',
        'kipo-sm':   '8px',
        'kipo':      '12px',
        'kipo-lg':   '16px',
        'kipo-xl':   '24px',
        'kipo-pill': '999px',
      },
      boxShadow: {
        'kipo-xs':     '0 1px 2px rgba(26, 21, 15, 0.06)',
        'kipo-sm':     '0 2px 8px rgba(26, 21, 15, 0.07)',
        'kipo-md':     '0 6px 20px rgba(26, 21, 15, 0.09)',
        'kipo-lg':     '0 16px 40px rgba(26, 21, 15, 0.12)',
        'kipo-brand':  '0 10px 30px rgba(206, 13, 47, 0.28)',
        'kipo-accent': '0 8px 24px rgba(169, 217, 43, 0.35)',
      },
    },
  },
  plugins: [],
}
