export type TenantId = string & { readonly _brand: 'TenantId' }

export const toTenantId = (raw: string): TenantId => raw as TenantId
