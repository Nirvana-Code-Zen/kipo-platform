// customers context's name for the tenant that owns a customer list.
// customers doesn't import UserId from the users context — it carries the same
// identity as a locally-branded string so bounded contexts stay decoupled.
export type TenantId = string & { readonly _brand: 'TenantId' }

export const toTenantId = (raw: string): TenantId => raw as TenantId
