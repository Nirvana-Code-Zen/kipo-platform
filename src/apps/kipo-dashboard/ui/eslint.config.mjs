import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import neostandard from 'neostandard'

const eslintConfig = defineConfig([
  ...neostandard({ ts: true }),
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      react: { version: '19.0' },
    },
  },
  {
    rules: {
      'no-restricted-imports': [2, {
        paths: [
          {
            name: 'next/font/google',
            message: 'Use @kipo/fonts instead.'
          },
          {
            name: 'next/font/local',
            message: 'Use @kipo/fonts instead.'
          }
        ]
      }],
      'react/sort-comp': [2, {
        order: [
          'static-variables',
          'static-methods',
          'instance-variables',
          'lifecycle',
          'everything-else',
          'render'
        ]
      }],
      'import/order': [2, {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          ['type', 'object']
        ],
        pathGroups: [
          {
            pattern: '{react,react-dom,react-dom/**}',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@/**',
            group: 'internal'
          },
          {
            pattern: '**/*.{css,scss,sass,less}',
            group: 'object',
            position: 'after'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'type'],
        'newlines-between': 'always'
      }]
    }
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ])
])

export default eslintConfig
