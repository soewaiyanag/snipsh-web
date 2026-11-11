import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { login } from '@/api/auth'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { setToken } from '@/features/auth/token'
import { DEMO_CREDENTIALS } from '@/mocks/demo'
import { routes } from '@/router'

export function renderApp(initialPath: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )

  return { router, user: userEvent.setup() }
}

export async function signInAsDemo() {
  const { accessToken } = await login(DEMO_CREDENTIALS)
  setToken(accessToken, DEMO_CREDENTIALS.email)
}
