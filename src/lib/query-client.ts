import { QueryClient } from '@tanstack/react-query'
import { ApiRequestError } from '@/api/client'

const MAX_RETRIES = 2
const FIRST_SERVER_ERROR_STATUS = 500

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // A 4xx will fail the same way again; only network failures and 5xx get another try.
        retry: (failureCount, error) =>
          failureCount < MAX_RETRIES &&
          !(
            error instanceof ApiRequestError &&
            error.status > 0 &&
            error.status < FIRST_SERVER_ERROR_STATUS
          ),
      },
    },
  })
}
