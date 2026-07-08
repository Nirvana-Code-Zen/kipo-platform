import { TAX_REGIMES } from '@/src/customers/ui/data/catalogs'

import type { CustomerCreateRequest, CustomerUpdateRequest, CustomerApiResponse } from '../../application/dtos/CustomerApiDTO'
import type { Customer as UICustomer } from '@/src/customers/ui/components/types'

function getRegimeLabel(code: string): string {
  return TAX_REGIMES.find((r) => r.code === code)?.label ?? code
}

function getInitials(legalName: string): string {
  return legalName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

export const CustomerApiMapper = {
  toCreateRequest(customer: UICustomer): CustomerCreateRequest {
    return {
      tax_id: customer.taxId,
      legal_name: customer.legalName,
      tax_regime: customer.taxRegimeCode ?? customer.taxRegime,
      zip: customer.zipCode ?? "",
      cfdi_use: customer.cfdiUsage ?? "",
      email: customer.email,
      avatar_url: customer.avatar || null,
    }
  },

  toUpdateRequest(customer: UICustomer): CustomerUpdateRequest {
    return {
      tax_id: customer.taxId,
      legal_name: customer.legalName,
      tax_regime: customer.taxRegimeCode ?? customer.taxRegime,
      zip: customer.zipCode ?? "",
      cfdi_use: customer.cfdiUsage ?? "",
      email: customer.email,
      avatar_url: customer.avatar || null,
    }
  },

  fromApiResponse(raw: CustomerApiResponse): UICustomer {
    return {
      id: raw.id,
      taxId: raw.tax_id,
      legalName: raw.legal_name,
      taxRegime: getRegimeLabel(raw.tax_regime),
      taxRegimeCode: raw.tax_regime,
      zipCode: raw.zip,
      cfdiUsage: raw.cfdi_use,
      email: raw.email,
      status: raw.is_active ? "active" : "inactive",
      avatar: raw.avatar_url ?? "",
      initials: getInitials(raw.legal_name),
    }
  },
}
