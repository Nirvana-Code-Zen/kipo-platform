import { execFileSync, spawn, type ChildProcess } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const RUNTIME_FILE = path.join(import.meta.dirname, '.runtime.json')

export const BACKEND_PORT = 8100
export const FRONTEND_PORT = 3100

type SupabaseStatus = {
  API_URL: string
  DB_URL: string
  PUBLISHABLE_KEY: string
  SECRET_KEY: string
  STORAGE_S3_URL: string
  S3_PROTOCOL_ACCESS_KEY_ID: string
  S3_PROTOCOL_ACCESS_KEY_SECRET: string
  S3_PROTOCOL_REGION: string
}

function waitFor(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const tick = () => {
      fetch(url)
        .then((res) => {
          if (res.status < 500) { resolve(); return }
          retry()
        })
        .catch(retry)
    }
    const retry = () => {
      if (Date.now() - start > timeoutMs) { reject(new Error(`Timed out waiting for ${url}`)); return }
      setTimeout(tick, 1000)
    }
    tick()
  })
}

function killGroup(child: ChildProcess | undefined) {
  if (!child?.pid) return
  try { process.kill(-child.pid, 'SIGTERM') } catch { /* already gone */ }
}

export default async function globalSetup() {
  let backend: ChildProcess | undefined
  let frontend: ChildProcess | undefined

  try {
    console.log('[e2e] starting isolated Supabase stack (workdir: e2e)...')
    execFileSync('supabase', ['start', '--workdir', 'e2e', '--yes'], { cwd: ROOT, stdio: 'inherit' })

    const status = JSON.parse(
      execFileSync('supabase', ['status', '--workdir', 'e2e', '-o', 'json'], { cwd: ROOT }).toString()
    ) as SupabaseStatus

    console.log('[e2e] starting backend on port', BACKEND_PORT)
    backend = spawn('uv', ['run', 'flask', 'run', '--port', String(BACKEND_PORT)], {
      cwd: path.join(ROOT, 'src/apps/kipo-platform'),
      env: {
        ...process.env,
        FLASK_ENV: 'development',
        PROJECT_URL: status.API_URL,
        DATABASE_URL: status.DB_URL,
        AUTH_KEY_PUBLISHABLE: status.PUBLISHABLE_KEY,
        AUTH_KEY_SECRET: status.SECRET_KEY,
        STORAGE_URL: status.STORAGE_S3_URL,
        STORAGE_ACCESS_KEY: status.S3_PROTOCOL_ACCESS_KEY_ID,
        STORAGE_SECRET_KEY: status.S3_PROTOCOL_ACCESS_KEY_SECRET,
        STORAGE_REGION: status.S3_PROTOCOL_REGION,
        CORS_EXTRA_ORIGINS: `http://localhost:${FRONTEND_PORT}`,
      },
      stdio: 'inherit',
      detached: true,
    })
    await waitFor(`http://localhost:${BACKEND_PORT}/api/v1/tenants/by-slug/__e2e_healthcheck__`, 60_000)

    console.log('[e2e] starting dashboard on port', FRONTEND_PORT)
    frontend = spawn('pnpm', ['--filter', 'kipo-dashboard-ui', 'dev', '--', '-p', String(FRONTEND_PORT)], {
      cwd: ROOT,
      env: {
        ...process.env,
        NEXT_PUBLIC_API_URL: `http://localhost:${BACKEND_PORT}`,
        NEXT_PUBLIC_APP_DOMAIN: 'localhost',
      },
      stdio: 'inherit',
      detached: true,
    })
    await waitFor(`http://localhost:${FRONTEND_PORT}/login`, 90_000)

    writeFileSync(RUNTIME_FILE, JSON.stringify({ backendPid: backend.pid, frontendPid: frontend.pid }))
    console.log('[e2e] stack ready.')
  } catch (err) {
    // Setup failed partway through — clean up whatever we managed to start
    // so a broken run never leaves containers/processes behind. Playwright
    // does not reliably call globalTeardown when globalSetup throws.
    console.error('[e2e] setup failed, cleaning up...', err)
    killGroup(backend)
    killGroup(frontend)
    try { execFileSync('supabase', ['stop', '--workdir', 'e2e', '--no-backup'], { cwd: ROOT, stdio: 'inherit' }) } catch { /* best effort */ }
    throw err
  }
}
