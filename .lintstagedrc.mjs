export default {
  '*.{ts,tsx,astro,js,jsx}': (files) => {
    const rootFiles = files.filter(f => !f.includes('/kipo-dashboard/ui/'))
    return rootFiles.length
      ? `eslint --max-warnings=0 --fix ${rootFiles.join(' ')}`
      : 'echo "lint-staged: no root files to lint"'
  }
}
