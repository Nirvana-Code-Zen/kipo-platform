import type { CatalogItem } from '@/src/catalogs/ui/data/catalogTypes'
import type { CustomerCreateRequest, CustomerUpdateRequest, CustomerApiResponse } from '../../application/dtos/CustomerApiDTO'
import type { Customer as UICustomer } from '@/src/customers/ui/components/shared/types'

function getRegimeLabel(code: string, regimenFiscal: CatalogItem[]): string {
  return regimenFiscal.find((r) => r.code === code)?.description ?? code
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
      email: customer.email,
      avatar_url: customer.avatar || null,
    }
  },

  fromApiResponse(raw: CustomerApiResponse, regimenFiscal: CatalogItem[]): UICustomer {
    return {
      id: raw.id,
      taxId: raw.tax_id,
      legalName: raw.legal_name,
      taxRegime: getRegimeLabel(raw.tax_regime, regimenFiscal),
      taxRegimeCode: raw.tax_regime,
      zipCode: raw.zip,
      email: raw.email,
      status: raw.is_active ? "active" : "inactive",
      avatar: raw.avatar_url ?? "",
      initials: getInitials(raw.legal_name),
    }
  },
}
