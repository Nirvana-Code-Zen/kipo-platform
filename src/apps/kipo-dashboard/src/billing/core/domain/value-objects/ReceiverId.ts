// billing context's view of who receives an invoice.
// billing doesn't know about the full Customer entity — just its identity.
export type ReceiverId = string & { readonly _brand: 'ReceiverId' }

export const toReceiverId = (raw: string): ReceiverId => raw as ReceiverId
