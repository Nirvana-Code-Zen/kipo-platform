export default {
  // Dashboard has its own ESLint config — run it in isolation, never pass files to avoid bypassing ignores
  'src/apps/kipo-dashboard/**/*.{ts,tsx,js,jsx,mjs}': () =>
    'pnpm --filter kipo-dashboard-ui lint',

  // Root ESLint handles landing, packages, and any other workspace files
  '!(src/apps/kipo-dashboard/**)*.{ts,tsx,astro,js,jsx}': (files) =>
    files.length
      ? `eslint --max-warnings=0 --fix ${files.join(' ')}`
      : 'echo "lint-staged: no root files to lint"',

  // Backend (kipo-api) — ruff reads src/apps/kipo-platform/pyproject.toml
  // regardless of cwd, so passing absolute staged file paths is safe.
  'src/apps/kipo-platform/**/*.py': (files) =>
    files.length
      ? `uv run --project src/apps/kipo-platform ruff check --fix ${files.join(' ')}`
      : 'echo "lint-staged: no kipo-api files to lint"',
}
