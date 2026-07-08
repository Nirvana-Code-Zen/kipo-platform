import path from 'path'

import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

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
        if (name && HOOK_ORDER.includes(name)) stack[stack.length - 1].push({ name, node })
      },
      'FunctionDeclaration:exit' () { validateHooks(stack.pop(), context) },
      'FunctionExpression:exit' () { validateHooks(stack.pop(), context) },
      'ArrowFunctionExpression:exit' () { validateHooks(stack.pop(), context) }
    }
  }
}

function validateHooks (hooks, context) {
  for (let i = 1; i < hooks.length; i++) {
    const prev = hooks[i - 1]
    const curr = hooks[i]
    if (HOOK_ORDER.indexOf(curr.name) < HOOK_ORDER.indexOf(prev.name)) {
      context.report({
        node: curr.node,
        messageId: 'wrongOrder',
        data: { hook: curr.name, blocker: prev.name, order: HOOK_ORDER.join(' → ') }
      })
    }
  }
}

const noCrossContextCore = {
  meta: {
    type: 'problem',
    docs: { description: 'Bounded context core/ is private. Import from ui/hooks/ to cross context boundaries.' },
    schema: [],
    messages: {
      fromOtherContext:
        "Cannot import '{{imported}}' context's core/ from '{{current}}' context. " +
        'Expose what other contexts need through {{imported}}/ui/hooks/ instead.',
      fromApp:
        "app/ pages cannot import core/ directly. Import from the context's ui/views/ only.",
    }
  },
  create (context) {
    return {
      ImportDeclaration (node) {
        const src = node.source.value

        const coreMatch = src.match(/^@\/src\/([a-z][a-z0-9-]*)\/core\//)
        if (!coreMatch) return
        const importedCtx = coreMatch[1]
        if (importedCtx === 'shared') return

        const filename = context.filename

        const fileCtxMatch = filename.match(/\/src\/([a-z][a-z0-9-]*)\/(core|ui)\//)
        if (!fileCtxMatch) {
          context.report({ node, messageId: 'fromApp' })
          return
        }

        const fileCtx = fileCtxMatch[1]
        if (fileCtx !== importedCtx) {
          context.report({
            node,
            messageId: 'fromOtherContext',
            data: { imported: importedCtx, current: fileCtx }
          })
        }
      }
    }
  }
}

const LAYER_RANK = { domain: 0, application: 1, infrastructure: 2 }

const noUpwardLayerImport = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce inward dependency direction: domain ← application ← infrastructure.' },
    schema: [],
    messages: {
      violation:
        "'{{current}}/' cannot import from '{{imported}}/' — " +
        'dependencies flow inward: domain ← application ← infrastructure.'
    }
  },
  create (context) {
    const filename = context.filename
    const currentLayerMatch = filename.match(/\/core\/(domain|application|infrastructure)\//)
    if (!currentLayerMatch) return {}

    const currentLayer = currentLayerMatch[1]
    const currentRank = LAYER_RANK[currentLayer]

    const check = (node, src) => {
      let importedLayer = null

      const absMatch = src.match(/\/core\/(domain|application|infrastructure)\//)
      if (absMatch) {
        importedLayer = absMatch[1]
      }

      if (!importedLayer && src.startsWith('.')) {
        const dir = path.dirname(filename)
        const resolved = path.resolve(dir, src)
        const relMatch = resolved.match(/\/core\/(domain|application|infrastructure)\//)
        if (relMatch) importedLayer = relMatch[1]
      }

      if (!importedLayer || importedLayer === currentLayer) return

      const importedRank = LAYER_RANK[importedLayer]
      if (importedRank > currentRank) {
        context.report({
          node,
          messageId: 'violation',
          data: { current: currentLayer, imported: importedLayer }
        })
      }
    }

    return {
      ImportDeclaration (node) { check(node, node.source.value) }
    }
  }
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      react: { version: '19.0' }
    }
  },
  {
    plugins: {
      local: {
        rules: {
          'hook-sort': hookSortRule,
          'no-cross-context-core': noCrossContextCore,
          'no-upward-layer-import': noUpwardLayerImport
        }
      }
    },
    rules: {
      'local/hook-sort': 'error',
      'local/no-cross-context-core': 'error',
      'local/no-upward-layer-import': 'error',

      'no-restricted-imports': ['error', {
        paths: [
          { name: 'next/font/google', message: 'Use @kipo/fonts instead.' },
          { name: 'next/font/local', message: 'Use @kipo/fonts instead.' }
        ]
      }],

      '@typescript-eslint/no-unused-vars': ['warn', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_'
      }],

      'react-hooks/react-compiler': 'off',
      'react-hooks/set-state-in-effect': 'off',

      // eslint-plugin-react@7.37.5 uses isSpaceBetweenTokens (removed in ESLint 10) in these JSX formatting rules
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-curly-spacing': 'off',
      'react/jsx-equals-spacing': 'off',
      'react/jsx-space-before-closing': 'off',
      'react/jsx-tag-spacing': 'off',
      'react-hooks/exhaustive-deps': 'off',

      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], ['type', 'object']],
        pathGroups: [
          { pattern: '{react,react-dom,react-dom/**}', group: 'external', position: 'before' },
          { pattern: '@/**', group: 'internal' },
          { pattern: '**/*.{css,scss,sass,less}', group: 'object', position: 'after' }
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'type'],
        'newlines-between': 'always'
      }]
    }
  },
  {
    files: ['src/*/core/**/*.ts', 'src/*/core/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['react', 'react/*', 'react-dom', 'react-dom/*'],
            message: 'core/ is framework-agnostic — React imports belong in ui/.'
          },
          {
            group: ['next', 'next/*'],
            message: 'core/ is framework-agnostic — Next.js imports belong in ui/ or app/.'
          }
        ]
      }]
    }
  },
  {
    files: ['app/**/*.ts', 'app/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@/src/*/core/**'],
            message: 'app/ pages import from ui/views/ only — never from core/ directly.'
          }
        ]
      }]
    }
  },
  {
    files: ['src/*/ui/**/*.ts', 'src/*/ui/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@/app/**'],
            message: 'ui/ cannot import from app/ — dependency flows app/ → ui/, not the reverse.'
          }
        ]
      }]
    }
  },

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '*.config.js',
    '*.config.mjs',
    '*.config.ts',
  ])
])

export default eslintConfig
