import pluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.astro/**',
      '**/storybook-static/**',
      '**/.cache/**',
      // kipo-dashboard has its own eslint.config.mjs — exclude it from the root config
      'src/apps/kipo-dashboard/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
    },
  },
  ...pluginAstro.configs['flat/recommended'],
];
