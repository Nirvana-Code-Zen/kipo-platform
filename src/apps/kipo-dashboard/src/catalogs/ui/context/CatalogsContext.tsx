"use client"

import { createContext } from "react"

import { useQueries } from "@tanstack/react-query"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import { CFDI_CATALOG_TYPES } from "../data/catalogTypes"

import type { CatalogItem } from "../data/catalogTypes"

export interface CatalogsContextValue {
  regimenFiscal: CatalogItem[]
  relacionFacturas: CatalogItem[]
  usoCfdi: CatalogItem[]
  metodoPago: CatalogItem[]
  formaPago: CatalogItem[]
  objetoImp: CatalogItem[]
  ivaTasa: CatalogItem[]
  tipoPercepcion: CatalogItem[]
  tipoRegimenNomina: CatalogItem[]
  meses: CatalogItem[]
  isLoading: boolean
}

export const CatalogsContext = createContext<CatalogsContextValue | null>(null)

const CATALOG_STALE_TIME = 1000 * 60 * 60
const EMPTY_CATALOG: CatalogItem[] = []

async function fetchCfdiCatalog(catalogType: string, accessToken: string | null): Promise<CatalogItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/catalogs/cfdi?type=${catalogType}`, {
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
  if (!res.ok) throw new Error(`No se pudo cargar el catálogo ${catalogType}`)
  return res.json() as Promise<CatalogItem[]>
}

export function CatalogsProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken)

  const results = useQueries({
    queries: Object.values(CFDI_CATALOG_TYPES).map((catalogType) => ({
      queryKey: ["catalogs", "cfdi", catalogType],
      queryFn: () => fetchCfdiCatalog(catalogType, accessToken),
      enabled: Boolean(accessToken),
      staleTime: CATALOG_STALE_TIME,
      refetchOnWindowFocus: false,
    })),
  })

  const keys = Object.keys(CFDI_CATALOG_TYPES) as Array<keyof typeof CFDI_CATALOG_TYPES>
  const byKey = Object.fromEntries(
    keys.map((key, index) => [key, results[index]?.data ?? EMPTY_CATALOG])
  ) as Record<keyof typeof CFDI_CATALOG_TYPES, CatalogItem[]>

  const value: CatalogsContextValue = {
    ...byKey,
    isLoading: results.some((r) => r.isLoading),
  }

  return (
    <CatalogsContext.Provider value={value}>
      {children}
    </CatalogsContext.Provider>
  )
}
