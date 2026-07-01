import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import neostandard from 'neostandard'

const HOOK_ORDER = ['useReducer', 'useState', 'useRef', 'useCallback', 'useMemo', 'useEffect']

const hookSortRule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Enforce hook call order: useReducer → useState → useRef → useCallback → useMemo → useEffect' },
    schema: [],
    messages: {
      wrongOrder: "'{{hook}}' must come before '{{blocker}}'. Expected order: {{order}}"
    }
  },
  create (context) {
    const stack = []

    return {
      FunctionDeclaration () { stack.push([]) },
      FunctionExpression () { stack.push([]) },
      ArrowFunctionExpression () { stack.push([]) },

      CallExpression (node) {
        if (!stack.length) return
        const name = node.callee.type === 'Identifier' ? node.callee.name : null
        if (name && HOOK_ORDER.includes(name)) {
          stack[stack.length - 1].push({ name, node })
        }
      },

      'FunctionDeclaration:exit' () { validate(stack.pop(), context) },
      'FunctionExpression:exit' () { validate(stack.pop(), context) },
      'ArrowFunctionExpression:exit' () { validate(stack.pop(), context) }
    }
  }
}

function validate (hooks, context) {
  for (let i = 1; i < hooks.length; i++) {
    const prev = hooks[i - 1]
    const curr = hooks[i]
    if (HOOK_ORDER.indexOf(curr.name) < HOOK_ORDER.indexOf(prev.name)) {
      context.report({
        node: curr.node,
        messageId: 'wrongOrder',
        data: {
          hook: curr.name,
          blocker: prev.name,
          order: HOOK_ORDER.join(' → ')
        }
      })
    }
  }
}

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
    plugins: {
      local: { rules: { 'hook-sort': hookSortRule } }
    },
    rules: {
      'local/hook-sort': 2,
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
