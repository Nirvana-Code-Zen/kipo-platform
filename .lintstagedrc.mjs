export default {
  // Dashboard has its own ESLint config — run it in isolation, never pass files to avoid bypassing ignores
  'src/apps/kipo-dashboard/**/*.{ts,tsx,js,jsx,mjs}': () =>
    'pnpm --filter kipo-dashboard-ui lint',

  // Root ESLint handles landing, packages, and any other workspace files
  '!(src/apps/kipo-dashboard/**)*.{ts,tsx,astro,js,jsx}': (files) =>
    files.length
      ? `eslint --max-warnings=0 --fix ${files.join(' ')}`
      : 'echo "lint-staged: no root files to lint"',
}
