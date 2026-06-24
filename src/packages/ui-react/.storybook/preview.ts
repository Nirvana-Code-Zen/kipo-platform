import '@kipo/theme/index.css'
import type { Preview } from '@storybook/react'
import { withThemeByDataAttribute } from '@storybook/addon-themes'

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    backgrounds: { disable: true },
    layout: 'centered',
  },
}

export default preview
