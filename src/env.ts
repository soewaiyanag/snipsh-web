import { z } from 'zod'

const baseUrl = z.url().transform((url) => url.replace(/\/+$/, ''))

const schema = z.object({
  VITE_API_URL: baseUrl,
  VITE_SHORT_DOMAIN: baseUrl,
  VITE_USE_MOCKS: z.enum(['true', 'false']).default('false'),
})

const parsed = schema.parse(import.meta.env)

export const env = {
  apiUrl: parsed.VITE_API_URL,
  shortDomain: parsed.VITE_SHORT_DOMAIN,
  useMocks: parsed.VITE_USE_MOCKS === 'true',
}
