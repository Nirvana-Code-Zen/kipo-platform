"use client"

import { useEmisorStore } from '../store/emisorStore'

export function useFiscalSettings() {
  const data = useEmisorStore((s) => s.data)
  const isLoaded = useEmisorStore((s) => s.isLoaded)
  const setData = useEmisorStore((s) => s.setData)
  return { data, isLoading: !isLoaded, setData }
}
