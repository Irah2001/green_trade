// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

import { cookies } from 'next/headers'
import { apiFetch } from './api'

const mockedCookies = vi.mocked(cookies)

describe('apiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads the auth token from next/headers in node runtime', async () => {
    mockedCookies.mockResolvedValue({
      get: (name: string) => (name === 'gt_token' ? { value: 'server-token' } : undefined),
    } as any)

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    })

    vi.stubGlobal('fetch', fetchMock)

    await apiFetch('/api/orders')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/api/orders',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer server-token',
        }),
      })
    )
  })
})
