const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
const numberFormat = new Intl.NumberFormat()

export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso))
}

export function formatNumber(value: number) {
  return numberFormat.format(value)
}
