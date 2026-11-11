import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { setToken } from '@/features/auth/token'
import { DEMO_CREDENTIALS } from '@/mocks/demo'
import { renderApp, signInAsDemo } from '@/test/render-app'
import { SLUG_TAKEN_MESSAGE } from './LinkForm'
import { LINKS_PAGE_SIZE } from './queries'

function findLinkList() {
  return screen.findByRole('list', { name: 'Your links' })
}

function createForm() {
  return within(screen.getByRole('region', { name: 'Make a short link' }))
}

async function fillAndSubmit(
  user: ReturnType<typeof renderApp>['user'],
  { url, slug }: { url: string; slug?: string },
) {
  const form = createForm()
  await user.type(form.getByLabelText('Long URL'), url)
  if (slug) {
    await user.click(form.getByRole('button', { name: 'Choose your own slug' }))
    await user.type(form.getByLabelText('Slug (optional)'), slug)
  }
  await user.click(form.getByRole('button', { name: 'Shorten' }))
}

describe('links page', () => {
  beforeEach(signInAsDemo)

  it('lists one page of links and offers the next page', async () => {
    renderApp('/links')

    const list = await findLinkList()
    expect(within(list).getAllByRole('listitem')).toHaveLength(LINKS_PAGE_SIZE)
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
  })

  it('creates a link and shows it at the top of the list', async () => {
    const { user } = renderApp('/links')
    await findLinkList()

    await fillAndSubmit(user, { url: 'https://example.com/a/long/address', slug: 'my-new-link' })

    const newLink = await screen.findByRole('link', { name: /my-new-link$/ })
    const rows = within(await findLinkList()).getAllByRole('listitem')
    expect(rows[0]).toContainElement(newLink)
    expect(createForm().getByLabelText('Long URL')).toHaveValue('')
  })

  it('shows a taken slug under the slug field', async () => {
    const { user } = renderApp('/links')
    await findLinkList()

    await fillAndSubmit(user, { url: 'https://example.com/another', slug: 'docs' })

    const slugField = createForm().getByLabelText('Slug (optional)')
    expect(await screen.findByText(SLUG_TAKEN_MESSAGE)).toBeInTheDocument()
    expect(slugField).toBeInvalid()
    expect(slugField).toHaveAccessibleDescription(SLUG_TAKEN_MESSAGE)
  })

  it('rejects an address that is not http or https before calling the API', async () => {
    const { user } = renderApp('/links')
    await findLinkList()

    await fillAndSubmit(user, { url: 'ftp://example.com/file' })

    expect(await screen.findByText('Enter a valid http:// or https:// URL')).toBeInTheDocument()
  })

  it('sends the user to /login when the token has expired', async () => {
    setToken('an-expired-token', DEMO_CREDENTIALS.email)
    const { router } = renderApp('/links')

    expect(await screen.findByRole('heading', { name: 'Log in' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(router.state.location.state).toMatchObject({ from: { pathname: '/links' } })
  })
})
