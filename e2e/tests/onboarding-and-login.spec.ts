import { test, expect } from '@playwright/test'
import path from 'node:path'

// Runs against the isolated Supabase stack booted by e2e/global-setup.ts —
// see e2e/playwright.config.ts. Everything this test writes (auth.users,
// public.tenants, the tenant schema, the uploaded avatar in Storage) lives
// only in that ephemeral stack and is destroyed by global-teardown.ts.
test.describe.serial('registro → onboarding → login', () => {
  const runId = Date.now()
  const email = `e2e-${runId}@kipo.test`
  const password = 'TestPass123!'
  const companyName = `E2E Tenant ${runId}`
  let tenantSlug = ''

  test('registro completo: onboarding con datos fiscales, CSD omitido', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel('Correo electrónico').fill(email)
    await page.getByLabel('Contraseña', { exact: true }).fill(password)
    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/v1/auth/sign-up') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Crear cuenta' }).click(),
    ])

    // /sign-up always reports email_pending regardless of whether Supabase
    // actually required confirmation (session.py). This stack disables
    // confirmations, so the account is already usable — log in directly
    // instead of following the "check your email" screen.
    await page.goto('/login')
    await page.getByLabel('Correo electrónico').fill(email)
    await page.getByLabel('Contraseña', { exact: true }).fill(password)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/onboarding$/)

    // Step 1: empresa — creates the tenant, read the real slug from the
    // API response instead of re-deriving the slugify logic here.
    await page.getByLabel('Nombre de la empresa').fill(companyName)
    const [registerResponse] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/v1/tenants/register') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Crear empresa y continuar →' }).click(),
    ])
    const registerBody = await registerResponse.json() as { slug: string }
    tenantSlug = registerBody.slug
    expect(tenantSlug).toBeTruthy()

    // Step 2: nombre para mostrar + avatar (ejercita storage de verdad)
    await page.getByLabel('Tu nombre completo').fill('Persona E2E')
    await page.locator('input[type="file"]').setInputFiles(path.join(import.meta.dirname, '../fixtures/avatar.png'))
    await page.getByRole('button', { name: 'Continuar →' }).click()

    // Step 3: datos fiscales — se llenan y se guardan (no se omite)
    await page.getByLabel('RFC').fill('ABC010101AB1')
    await page.getByLabel('Razón social').fill('E2E Test SA de CV')
    const regimenSelect = page.locator('select')
    await regimenSelect.locator('option').nth(1).waitFor({ state: 'attached' })
    await regimenSelect.selectOption({ index: 1 })
    await page.getByLabel('Código postal').fill('06600')
    await page.getByRole('button', { name: 'Guardar y continuar' }).click()

    // Step 4: CSD — se omite explícitamente (el escenario pedido)
    await expect(page.getByRole('button', { name: 'Omitir por ahora' })).toBeVisible()
    await page.getByRole('button', { name: 'Omitir por ahora' }).click()

    await expect(page).toHaveURL(new RegExp(`^http://${tenantSlug}\\.localhost:3100/dashboard`))
  })

  test('login con la cuenta creada entra directo a su subdominio', async ({ page }) => {
    expect(tenantSlug, 'requires the previous test to have created the tenant').toBeTruthy()

    // Fresh browser context (Playwright isolates storage per test) — starts
    // on the main domain, not the tenant subdomain, to prove the redirect
    // actually happens on a normal login and not just after onboarding.
    await page.goto('http://localhost:3100/login')
    await page.getByLabel('Correo electrónico').fill(email)
    await page.getByLabel('Contraseña', { exact: true }).fill(password)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(new RegExp(`^http://${tenantSlug}\\.localhost:3100/dashboard`))
  })

  test('recargar el dashboard no expulsa al login', async ({ page }) => {
    expect(tenantSlug, 'requires the previous test to have created the tenant').toBeTruthy()

    await page.goto('http://localhost:3100/login')
    await page.getByLabel('Correo electrónico').fill(email)
    await page.getByLabel('Contraseña', { exact: true }).fill(password)
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(new RegExp(`^http://${tenantSlug}\\.localhost:3100/dashboard`))

    await page.reload()

    // Debe seguir en el dashboard del tenant — nunca rebotar a /login.
    await expect(page).toHaveURL(new RegExp(`^http://${tenantSlug}\\.localhost:3100/dashboard`))
  })
})
