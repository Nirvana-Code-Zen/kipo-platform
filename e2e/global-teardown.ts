import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const RUNTIME_FILE = path.join(import.meta.dirname, '.runtime.json')

function killGroup(pid: number | undefined) {
  if (!pid) return
  try { process.kill(-pid, 'SIGTERM') } catch { /* already gone */ }
}

export default async function globalTeardown() {
  if (existsSync(RUNTIME_FILE)) {
    const { backendPid, frontendPid } = JSON.parse(readFileSync(RUNTIME_FILE, 'utf8')) as {
      backendPid?: number
      frontendPid?: number
    }
    console.log('[e2e] stopping backend/frontend...')
    killGroup(backendPid)
    killGroup(frontendPid)
    rmSync(RUNTIME_FILE, { force: true })
  }

  console.log('[e2e] tearing down isolated Supabase stack (destroying volumes)...')
  try {
    execFileSync('supabase', ['stop', '--workdir', 'e2e', '--no-backup'], { cwd: ROOT, stdio: 'inherit' })
  } catch (err) {
    console.error('[e2e] supabase stop failed — run manually: supabase stop --workdir e2e --no-backup', err)
  }
}
