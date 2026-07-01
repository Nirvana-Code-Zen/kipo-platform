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
      'src/apps/kipo-dashboard/ui/**',
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
