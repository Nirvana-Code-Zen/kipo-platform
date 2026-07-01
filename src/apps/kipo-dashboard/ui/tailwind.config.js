'use strict'

const kipoPreset = require('@kipo/theme/tailwind.preset')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [kipoPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui-react/src/**/*.{ts,tsx}'
  ]
}
