import { test, expect } from '@playwright/test'
import path from 'node:path'

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

    await page.goto('/login')
    await page.getByLabel('Correo electrónico').fill(email)
    await page.getByLabel('Contraseña', { exact: true }).fill(password)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/onboarding$/)

    await page.getByLabel('Nombre de la empresa').fill(companyName)
    const [registerResponse] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/v1/tenants/register') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Crear empresa y continuar →' }).click(),
    ])
    const registerBody = await registerResponse.json() as { slug: string }
    tenantSlug = registerBody.slug
    expect(tenantSlug).toBeTruthy()

    await page.getByLabel('Tu nombre completo').fill('Persona E2E')
    await page.locator('input[type="file"]').setInputFiles(path.join(import.meta.dirname, '../fixtures/avatar.png'))
    await page.getByRole('button', { name: 'Continuar →' }).click()

    await page.getByLabel('RFC').fill('ABC010101AB1')
    await page.getByLabel('Razón social').fill('E2E Test SA de CV')
    const regimenSelect = page.locator('select')
    await regimenSelect.locator('option').nth(1).waitFor({ state: 'attached' })
    await regimenSelect.selectOption({ index: 1 })
    await page.getByLabel('Código postal').fill('06600')
    await page.getByRole('button', { name: 'Guardar y continuar' }).click()

    await expect(page.getByRole('button', { name: 'Omitir por ahora' })).toBeVisible()
    await page.getByRole('button', { name: 'Omitir por ahora' }).click()

    await expect(page).toHaveURL(new RegExp(`^http://${tenantSlug}\\.localhost:3100/dashboard`))
  })

  test('login con la cuenta creada entra directo a su subdominio', async ({ page }) => {
    expect(tenantSlug, 'requires the previous test to have created the tenant').toBeTruthy()

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

    await expect(page).toHaveURL(new RegExp(`^http://${tenantSlug}\\.localhost:3100/dashboard`))
  })
})
