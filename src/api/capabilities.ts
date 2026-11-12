import { env } from '@/env'

// The deployed API has no stats endpoint and, by design, no update endpoint.
// shortcut: derived from the mock flag; replace with real detection if the API gains them.
export const capabilities = { stats: env.useMocks, editLinks: env.useMocks }
