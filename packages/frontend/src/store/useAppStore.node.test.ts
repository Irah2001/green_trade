// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('zustand/middleware', () => ({
  persist: (initializer: any) => initializer,
  createJSONStorage: () => undefined,
}))

vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    signup: vi.fn(),
  },
}))

vi.mock('@/services/cart.service', () => ({
  cartService: {
    getCart: vi.fn().mockResolvedValue({ items: [] }),
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateItem: vi.fn(),
    clearCart: vi.fn(),
  },
}))

import { authService } from '@/services/auth.service'
import { cartService } from '@/services/cart.service'
import { useAppStore } from './useAppStore'

const mockedAuthService = vi.mocked(authService)
const mockedCartService = vi.mocked(cartService)

describe('useAppStore auth token persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAuthService.login.mockResolvedValue({
      user: { id: 'user-1' },
      token: 'token-123',
    } as any)
    mockedCartService.getCart.mockResolvedValue({ items: [] } as any)
    useAppStore.setState({ user: null, isAuthenticated: false, cart: [] })
  })

  it('logs in without browser globals', async () => {
    await expect(useAppStore.getState().login('user@example.com', 'secret')).resolves.toEqual({
      success: true,
    })
  })

  it('logs out without browser globals', () => {
    expect(() => useAppStore.getState().logout()).not.toThrow()
  })
})
