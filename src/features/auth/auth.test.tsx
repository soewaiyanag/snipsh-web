import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DEMO_CREDENTIALS } from '@/mocks/demo'
import { renderApp } from '@/test/render-app'
import { getToken } from './token'

async function logIn(user: ReturnType<typeof renderApp>['user'], password: string) {
  await user.type(await screen.findByLabelText('Email'), DEMO_CREDENTIALS.email)
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Log in' }))
}

describe('auth redirect', () => {
  it('sends a signed-out visitor to /login, then back to the page they wanted', async () => {
    const { router, user } = renderApp('/links')

    expect(await screen.findByRole('heading', { name: 'Log in' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')

    await logIn(user, DEMO_CREDENTIALS.password)

    expect(await screen.findByRole('heading', { name: 'Your links' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/links')
    expect(screen.getByText(DEMO_CREDENTIALS.email)).toBeInTheDocument()
  })

  it("shows the server's message for a wrong password and stays signed out", async () => {
    const { router, user } = renderApp('/login')

    await logIn(user, 'not-the-password')

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')
    expect(router.state.location.pathname).toBe('/login')
    expect(getToken()).toBeNull()
  })

  it('logs out to the landing page and clears the token', async () => {
    const { router, user } = renderApp('/links')
    await logIn(user, DEMO_CREDENTIALS.password)

    await user.click(await screen.findByRole('button', { name: 'Log out' }))

    expect(await screen.findByRole('link', { name: 'Log in' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
    expect(getToken()).toBeNull()
  })
})
