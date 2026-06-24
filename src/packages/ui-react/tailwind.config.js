'use strict'

const kipoPreset = require('@kipo/theme/tailwind.preset')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [kipoPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
