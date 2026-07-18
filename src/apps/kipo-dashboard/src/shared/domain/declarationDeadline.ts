import { addBusinessDays, nextBusinessDay } from "./businessDays"
import { detectRfcType, getRfcSixthDigit } from "./rfc"

export interface DeclarationDeadlineResult {
  deadline: Date
  extraBusinessDays: number
  hasProrroga: boolean
}

const PRORROGA_DAYS: Record<number, number> = {
  1: 1, 2: 1,
  3: 2, 4: 2,
  5: 3, 6: 3,
  7: 4, 8: 4,
  9: 5, 0: 5,
}

function getProrrogaBusinessDays(rfc: string | null | undefined): number {
  if (!rfc) return 0
  const type = detectRfcType(rfc)
  if (type !== "natural" && type !== "legal") return 0
  const digit = getRfcSixthDigit(rfc)
  if (digit === null) return 0
  return PRORROGA_DAYS[digit] ?? 0
}

function computeDeadlineForPeriod(
  year: number,
  month: number,
  rfc: string | null | undefined
): DeclarationDeadlineResult {
  const rawDay17 = new Date(year, month, 17, 23, 59, 59)
  const rolledDay17 = nextBusinessDay(rawDay17)

  const extraBusinessDays = getProrrogaBusinessDays(rfc)
  const deadline = extraBusinessDays > 0 ? addBusinessDays(rolledDay17, extraBusinessDays) : rolledDay17
  deadline.setHours(23, 59, 59, 0)

  return { deadline, extraBusinessDays, hasProrroga: extraBusinessDays > 0 }
}

export function getMonthlyDeclarationDeadline(
  rfc: string | null | undefined,
  referenceDate: Date = new Date()
): DeclarationDeadlineResult {
  const currentPeriod = computeDeadlineForPeriod(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    rfc
  )

  if (referenceDate.getTime() <= currentPeriod.deadline.getTime()) {
    return currentPeriod
  }

  const nextMonth = referenceDate.getMonth() + 1
  const nextYear = referenceDate.getFullYear() + Math.floor(nextMonth / 12)
  return computeDeadlineForPeriod(nextYear, nextMonth % 12, rfc)
}
