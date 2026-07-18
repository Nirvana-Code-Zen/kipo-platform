"use client"

import { useMemo } from "react"

import { getMonthlyDeclarationDeadline } from "@/src/shared/domain/declarationDeadline"
import { useEmisorStore } from "@/src/settings/ui/store/emisorStore"

export interface UseDeclarationDeadlineResult {
  deadline: Date
  hasProrroga: boolean
  extraBusinessDays: number
}

export function useDeclarationDeadline(): UseDeclarationDeadlineResult {
  const rfc = useEmisorStore((s) => s.data?.rfc)

  return useMemo(() => getMonthlyDeclarationDeadline(rfc), [rfc])
}
