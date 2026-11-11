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
