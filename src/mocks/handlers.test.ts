import { beforeEach, describe, expect, it } from 'vitest'
import { login, register } from '@/api/auth'
import { HTTP_STATUS } from '@/api/client'
import { createLink, deleteLink, getLink, listLinks, updateLink } from '@/api/links'
import { getLinkStats } from '@/api/stats'
import { setToken } from '@/features/auth/token'

const DEMO = { email: 'demo@snipsh.com', password: 'password123' }
const PAGE_SIZE = 20
const BAD_REQUEST = 400

async function loginAs(credentials: typeof DEMO) {
  const { accessToken } = await login(credentials)
  setToken(accessToken, credentials.email)
}

describe('mock API contract', () => {
  beforeEach(() => loginAs(DEMO))

  it('rejects a wrong password with 401', async () => {
    await expect(login({ ...DEMO, password: 'nope-nope' })).rejects.toMatchObject({
      status: HTTP_STATUS.unauthorized,
    })
  })

  it('rejects a taken email with 409 and an invalid body with 400', async () => {
    await expect(register(DEMO)).rejects.toMatchObject({ status: HTTP_STATUS.conflict })
    await expect(register({ email: 'nope', password: 'short' })).rejects.toMatchObject({
      status: BAD_REQUEST,
    })
  })

  it('paginates the list', async () => {
    const first = await listLinks({ page: 1, limit: PAGE_SIZE })
    const second = await listLinks({ page: 2, limit: PAGE_SIZE })
    expect(first.items).toHaveLength(PAGE_SIZE)
    expect(second.items).toHaveLength(first.total - PAGE_SIZE)
  })

  it('requires a token', async () => {
    localStorage.clear()
    await expect(listLinks({ page: 1, limit: PAGE_SIZE })).rejects.toMatchObject({
      status: HTTP_STATUS.unauthorized,
    })
  })

  it('creates, edits and deletes a link, with 409 on a taken slug', async () => {
    const created = await createLink({ url: 'https://example.com/new' })
    expect(created.slug).toMatch(/^[A-Za-z0-9]{5}$/)
    await expect(createLink({ url: 'https://example.com', slug: 'docs' })).rejects.toMatchObject({
      status: HTTP_STATUS.conflict,
    })
    await expect(updateLink(created.id, { slug: 'docs' })).rejects.toMatchObject({
      status: HTTP_STATUS.conflict,
    })

    const updated = await updateLink(created.id, { slug: 'renamed' })
    expect(updated).toMatchObject({ slug: 'renamed', url: 'https://example.com/new' })
    expect(await getLinkStats(created.id)).toMatchObject({ total: 0 })

    await deleteLink(created.id)
    await expect(getLink(created.id)).rejects.toMatchObject({ status: HTTP_STATUS.notFound })
  })

  it("answers 404 for another user's link", async () => {
    const stranger = { email: 'stranger@example.com', password: 'password123' }
    await register(stranger)
    await loginAs(stranger)
    await expect(getLink('link-1')).rejects.toMatchObject({ status: HTTP_STATUS.notFound })
    expect((await listLinks({ page: 1, limit: PAGE_SIZE })).total).toBe(0)
  })
})
