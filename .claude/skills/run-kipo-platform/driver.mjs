#!/usr/bin/env node
/**
 * Kipo Platform driver — launches either app and takes screenshots via Playwright.
 * Usage: node driver.mjs <landing|app> [--url http://...] [--out /path/to/dir]
 *
 * Assumes the target dev server is already running.
 */
import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import { resolve, join } from 'path'

const PORTS = { landing: 4321, app: 5173 }
const DEFAULTS = { landing: 'http://localhost:4321', app: 'http://localhost:5173' }

async function main() {
  const target = process.argv[2] ?? 'landing'
  const args = process.argv.slice(3)

  const urlFlag = args.indexOf('--url')
  const url = urlFlag !== -1 ? args[urlFlag + 1] : DEFAULTS[target]

  const outFlag = args.indexOf('--out')
  const outDir = resolve(outFlag !== -1 ? args[outFlag + 1] : `/tmp/kipo-screenshots/${target}`)

  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch({ args: ['--no-sandbox'] })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()

  const errors = []
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })

  console.log(`Navigating to ${url}`)
  await page.goto(url, { waitUntil: 'networkidle' })

  const title = await page.title()
  console.log(`Page title: ${title}`)

  // Screenshot 1: initial view
  const ss1 = join(outDir, '01-initial.png')
  await page.screenshot({ path: ss1, fullPage: false })
  console.log(`Screenshot: ${ss1}`)

  if (target === 'landing') {
    // Scroll to features section
    await page.evaluate(() => window.scrollTo(0, window.innerHeight))
    await page.waitForTimeout(300)
    const ss2 = join(outDir, '02-scrolled.png')
    await page.screenshot({ path: ss2, fullPage: false })
    console.log(`Screenshot: ${ss2}`)
  }

  if (target === 'app') {
    // Click primary button to verify interaction
    const btn = page.locator('button', { hasText: 'Pagar' }).first()
    if (await btn.count()) {
      await btn.click()
      await page.waitForTimeout(200)
    }
    const ss2 = join(outDir, '02-interacted.png')
    await page.screenshot({ path: ss2, fullPage: true })
    console.log(`Screenshot: ${ss2}`)
  }

  if (errors.length) {
    console.error('Console errors:', errors)
    process.exitCode = 1
  } else {
    console.log('No console errors.')
  }

  await browser.close()
}

main().catch(err => { console.error(err); process.exit(1) })
