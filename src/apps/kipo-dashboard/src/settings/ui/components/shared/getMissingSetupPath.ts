import type { UIFiscalSettings } from './types'

export type EmisorSetupStep = 'fiscal' | 'csd' | 'manifest'

export interface EmisorSetupStepInfo {
  step: EmisorSetupStep
  savedMessage: string
  nextTitle: string
  nextDescription: string
  ctaLabel: string
}

export const EMISOR_SETUP_PATHS = {
  fiscal: '/settings?openFiscal=true',
  csd: '/settings?openCsd=true',
  manifest: '/settings?openManifest=true',
} as const

export function getMissingSetupPath(issuer: UIFiscalSettings | null): string | null {
  if (!issuer) return EMISOR_SETUP_PATHS.fiscal
  if (!issuer.csdConfigured) return EMISOR_SETUP_PATHS.csd
  if (!issuer.manifiestoSigned) return EMISOR_SETUP_PATHS.manifest
  return null
}

export function getNextEmisorSetupStep(issuer: UIFiscalSettings): EmisorSetupStepInfo | null {
  if (!issuer.csdConfigured) {
    return {
      step: 'csd',
      savedMessage: 'Datos fiscales guardados',
      nextTitle: 'Siguiente paso: certificado CSD',
      nextDescription: 'Sube tu Certificado de Sello Digital del SAT para poder timbrar facturas.',
      ctaLabel: 'Configurar CSD',
    }
  }

  if (!issuer.manifiestoSigned) {
    return {
      step: 'manifest',
      savedMessage: 'CSD configurado',
      nextTitle: 'Siguiente paso: Carta Manifiesto',
      nextDescription: 'Firma tu Carta Manifiesto con tu e.firma (FIEL) para completar la configuración.',
      ctaLabel: 'Firmar manifiesto',
    }
  }

  return null
}
