"use client"

import { useContext } from "react"

import { CatalogsContext } from "../context/CatalogsContext"

export function useCatalogs() {
  const context = useContext(CatalogsContext)
  if (!context) {
    throw new Error("useCatalogs debe usarse dentro de un CatalogsProvider")
  }
  return context
}
