import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    server: {
      fs: {
        // allow workspace root so @kipo/fonts can resolve font files
        allow: ['../..'],
      },
    },
  },
})
