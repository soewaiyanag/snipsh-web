import { describe, expect, it } from 'vitest'
import { fillDays } from './fill-days'

describe('fillDays', () => {
  it('adds the missing days with zero clicks, in date order', () => {
    const filled = fillDays([
      { date: '2026-03-02', count: 4 },
      { date: '2026-02-27', count: 1 },
    ])

    expect(filled).toEqual([
      { date: '2026-02-27', count: 1 },
      { date: '2026-02-28', count: 0 },
      { date: '2026-03-01', count: 0 },
      { date: '2026-03-02', count: 4 },
    ])
  })

  it('returns nothing for a link with no clicks', () => {
    expect(fillDays([])).toEqual([])
  })
})
