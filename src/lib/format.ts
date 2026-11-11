const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
const numberFormat = new Intl.NumberFormat()

export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso))
}

export function formatNumber(value: number) {
  return numberFormat.format(value)
}

// Stats days arrive as "YYYY-MM-DD", which parses as UTC; format in UTC so the day never shifts.
const dayFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

export function formatDay(date: string) {
  return dayFormat.format(new Date(date))
}

const MS_PER_DAY = 86_400_000
const DAYS_PER_MONTH = 30
const DAYS_PER_YEAR = 365
const relativeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

// "today", "3 days ago", "2 months ago": how people remember when they made a link.
export function formatRelative(iso: string) {
  const days = Math.round((new Date(iso).getTime() - Date.now()) / MS_PER_DAY)
  if (Math.abs(days) < DAYS_PER_MONTH) return relativeFormat.format(days, 'day')
  if (Math.abs(days) < DAYS_PER_YEAR) return relativeFormat.format(Math.round(days / DAYS_PER_MONTH), 'month')
  return relativeFormat.format(Math.round(days / DAYS_PER_YEAR), 'year')
}
