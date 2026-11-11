import { request } from './client'
import type { Credentials } from './schemas'
import type { AuthToken, User } from './types'

export function register(credentials: Credentials) {
  return request<User>('/auth/register', {
    method: 'POST',
    body: credentials,
    authenticated: false,
  })
}

export function login(credentials: Credentials) {
  return request<AuthToken>('/auth/login', {
    method: 'POST',
    body: credentials,
    authenticated: false,
  })
}
