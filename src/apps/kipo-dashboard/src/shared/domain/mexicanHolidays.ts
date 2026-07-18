function nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const date = new Date(year, month, 1)
  let count = 0
  while (true) {
    if (date.getDay() === weekday) {
      count += 1
      if (count === n) return date
    }
    date.setDate(date.getDate() + 1)
  }
}

export function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

// SAT también suspende labores durante sus "vacaciones generales" (bloques
// variables de ~2 semanas en julio y diciembre, publicados administrativamente
// cada año) — esos periodos NO están incluidos aquí porque no se derivan de una
// regla fija; solo se modelan los feriados oficiales del Art. 74 LFT.
export function getMexicanHolidays(year: number): Date[] {
  const easter = easterSunday(year)
  const juevesSanto = new Date(easter)
  juevesSanto.setDate(easter.getDate() - 3)
  const viernesSanto = new Date(easter)
  viernesSanto.setDate(easter.getDate() - 2)

  const holidays = [
    new Date(year, 0, 1),
    nthWeekdayOfMonth(year, 1, 1, 1),
    nthWeekdayOfMonth(year, 2, 1, 3),
    juevesSanto,
    viernesSanto,
    new Date(year, 4, 1),
    new Date(year, 8, 16),
    nthWeekdayOfMonth(year, 10, 1, 3),
    new Date(year, 11, 25),
  ]

  if ((year - 2024) % 6 === 0) {
    holidays.push(new Date(year, 11, 1))
  }

  return holidays
}

export function isHoliday(date: Date): boolean {
  return getMexicanHolidays(date.getFullYear()).some(
    (holiday) =>
      holiday.getFullYear() === date.getFullYear() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getDate() === date.getDate()
  )
}
