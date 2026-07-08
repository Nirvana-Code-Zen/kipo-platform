import { Suspense } from 'react'

import { CustomersDashboard } from '@/src/customers/ui/views/CustomersDashboard'

export default function CustomersPage() {
  return (
    <Suspense>
      <CustomersDashboard />
    </Suspense>
  )
}
