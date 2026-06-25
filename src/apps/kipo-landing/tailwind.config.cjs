'use strict'

const kipoPreset = require('@kipo/theme/tailwind.preset')

module.exports = {
  presets: [kipoPreset],
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}',
  ],
}
