'use client'

import { create } from 'zustand'

import type { UIFiscalSettings } from '../components/shared/types'

interface EmisorState {
  data: UIFiscalSettings | null
  isLoaded: boolean
  setData: (data: UIFiscalSettings | null) => void
  markLoaded: () => void
  reset: () => void
}

export const useEmisorStore = create<EmisorState>()((set) => ({
  data: null,
  isLoaded: false,
  setData: (data) => set({ data, isLoaded: true }),
  markLoaded: () => set({ isLoaded: true }),
  reset: () => set({ data: null, isLoaded: false }),
}))
