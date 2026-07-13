export interface CatalogItem {
  code: string
  description: string
}

export const CFDI_CATALOG_TYPES = {
  regimenFiscal: "regimen_fiscal",
  relacionFacturas: "relacion_facturas",
  usoCfdi: "uso_cfdi",
  metodoPago: "metodo_pago",
  formaPago: "forma_pago",
  objetoImp: "objeto_imp",
  ivaTasa: "iva_tasa",
  tipoPercepcion: "tipo_percepcion",
  tipoRegimenNomina: "tipo_regimen_nomina",
  meses: "mes",
} as const
