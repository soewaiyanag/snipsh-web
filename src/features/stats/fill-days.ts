import type { LinkStats } from '@/api/types'

const MS_PER_DAY = 86_400_000

type Day = LinkStats['perDay'][number]

// The API may leave out days with no clicks. A chart that skips them would hide the quiet days.
export function fillDays(perDay: Day[]): Day[] {
  if (perDay.length === 0) return []

  const counts = new Map(perDay.map(({ date, count }) => [date, count]))
  const dates = [...counts.keys()].sort()
  const last = Date.parse(dates[dates.length - 1])
  const days: Day[] = []

  for (let time = Date.parse(dates[0]); time <= last; time += MS_PER_DAY) {
    const date = new Date(time).toISOString().slice(0, 10)
    days.push({ date, count: counts.get(date) ?? 0 })
  }
  return days
}
