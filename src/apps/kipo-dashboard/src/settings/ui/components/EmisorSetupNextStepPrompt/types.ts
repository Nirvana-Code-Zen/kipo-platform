export interface EmisorSetupNextStepPromptProps {
  savedMessage: string
  nextTitle: string
  nextDescription: string
  ctaLabel: string
  onContinue: () => void
  onClose: () => void
}
