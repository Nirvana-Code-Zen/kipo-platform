import { DashboardShell } from '@/src/shared/ui/layout/DashboardShell'

export default function ProtectedLayout ({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
