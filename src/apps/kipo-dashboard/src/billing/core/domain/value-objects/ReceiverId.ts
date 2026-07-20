export type ReceiverId = string & { readonly _brand: 'ReceiverId' }

export const toReceiverId = (raw: string): ReceiverId => raw as ReceiverId
