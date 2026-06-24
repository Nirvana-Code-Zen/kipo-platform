import '@kipo/theme/index.css'
import './preview.css'
import type { Decorator, Preview } from '@storybook/react'
import React, { useEffect } from 'react'
import { useDarkMode } from 'storybook-dark-mode'

const ThemeDecorator: Decorator = (Story) => {
  const isDark = useDarkMode()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '')
  }, [isDark])

  return <Story />
}

const preview: Preview = {
  decorators: [ThemeDecorator],
  parameters: {
    backgrounds: { disable: true },
    layout: 'centered',
    darkMode: {
      stylePreview: true,
    },
  },
}

export default preview
