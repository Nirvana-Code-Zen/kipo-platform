'use client'

import { CheckCircle2, Info } from 'lucide-react'
import { Button } from '@kipo/ui-react'

import type { EmisorSetupNextStepPromptProps } from './types'

export function EmisorSetupNextStepPrompt({
  savedMessage,
  nextTitle,
  nextDescription,
  ctaLabel,
  onContinue,
  onClose,
}: EmisorSetupNextStepPromptProps) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex flex-col items-center text-center gap-2">
        <CheckCircle2 className="w-10 h-10 text-success" />
        <p className="font-semibold text-foreground font-sans">{savedMessage}</p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-banner-info-border bg-banner-info-bg px-4 py-3.5">
        <Info className="w-4 h-4 shrink-0 text-banner-info-icon mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-banner-info-text font-sans">{nextTitle}</p>
          <p className="text-[13px] text-banner-info-text mt-1 font-sans leading-relaxed opacity-90">
            {nextDescription}
          </p>
        </div>
      </div>

      <div className="flex gap-2.5">
        <Button type="button" variant="secondary" size="md" full onClick={onClose}>
          Cerrar
        </Button>
        <Button type="button" variant="primary" size="md" full onClick={onContinue}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
