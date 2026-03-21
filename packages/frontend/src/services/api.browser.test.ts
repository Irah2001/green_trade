import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiFetch } from './api'

describe('apiFetch in the browser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    document.cookie = 'gt_token=; path=/; max-age=0'
  })

  it('prefers localStorage over the cookie token', async () => {
    localStorage.setItem('gt_token', 'browser-token')
    document.cookie = 'gt_token=cookie-token; path=/'

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
          Authorization: 'Bearer browser-token',
        }),
      })
    )
  })
})
