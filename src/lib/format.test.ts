import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatRelative } from './format'

const MS_PER_DAY = 86_400_000

describe('formatRelative', () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date('2026-11-12T12:00:00Z') }))
  afterEach(() => vi.useRealTimers())

  const daysAgo = (days: number) => new Date(Date.now() - days * MS_PER_DAY).toISOString()

  it('says "today" for a link made today', () => {
    expect(formatRelative(daysAgo(0))).toBe('today')
  })

  it('counts days for the first month, then months, then years', () => {
    expect(formatRelative(daysAgo(3))).toBe('3 days ago')
    expect(formatRelative(daysAgo(65))).toBe('2 months ago')
    expect(formatRelative(daysAgo(800))).toBe('2 years ago')
  })
})
