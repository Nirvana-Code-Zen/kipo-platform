'use strict'

const kipoPreset = require('@kipo/theme/tailwind.preset')

module.exports = {
  presets: [kipoPreset],
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        'display': ['var(--fs-display)', { lineHeight: 'var(--lh-tight)' }],
        'h1':      ['var(--fs-h1)',      { lineHeight: 'var(--lh-heading)' }],
        'h2':      ['var(--fs-h2)',      { lineHeight: 'var(--lh-heading)' }],
        'h3':      ['var(--fs-h3)',      { lineHeight: 'var(--lh-snug)' }],
        'h4':      ['var(--fs-h4)',      { lineHeight: 'var(--lh-snug)' }],
        'lg':      ['var(--fs-lg)',      { lineHeight: 'var(--lh-body)' }],
        'base':    ['var(--fs-base)',    { lineHeight: 'var(--lh-body)' }],
        'sm':      ['var(--fs-sm)',      { lineHeight: 'var(--lh-body)' }],
        'xs':      ['var(--fs-xs)',      { lineHeight: 'var(--lh-body)' }],
      },
      fontWeight: {
        'light':     'var(--fw-light)',
        'normal':   'var(--fw-regular)',
        'medium':    'var(--fw-medium)',
        'semibold':  'var(--fw-semibold)',
        'bold':      'var(--fw-bold)',
        'extrabold': 'var(--fw-extrabold)',
      },
      lineHeight: {
        'tight':   'var(--lh-tight)',
        'heading': 'var(--lh-heading)',
        'snug':    'var(--lh-snug)',
        'body':    'var(--lh-body)',
      },
    },
  },
}
