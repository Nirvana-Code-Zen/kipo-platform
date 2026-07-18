import { isHoliday } from "./mexicanHolidays"

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function isBusinessDay(date: Date): boolean {
  return !isWeekend(date) && !isHoliday(date)
}

export function nextBusinessDay(date: Date): Date {
  const result = new Date(date)
  while (!isBusinessDay(result)) {
    result.setDate(result.getDate() + 1)
  }
  return result
}

export function addBusinessDays(date: Date, n: number): Date {
  const result = new Date(date)
  let added = 0
  while (added < n) {
    result.setDate(result.getDate() + 1)
    if (isBusinessDay(result)) added += 1
  }
  return result
}
