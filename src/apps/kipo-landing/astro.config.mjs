import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    server: {
      fs: {
        allow: [
          __dirname,
          path.resolve(__dirname, 'src/packages'),
          path.resolve(__dirname, '..'),
          path.resolve(__dirname, '../../..')
        ],
      },
    },
  },
})
