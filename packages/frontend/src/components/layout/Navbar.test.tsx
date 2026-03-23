// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import Navbar from '@/components/layout/Navbar'
import { useAppStore } from '@/store/useAppStore'
import { useIsClient } from '@/hooks/use-is-client'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('@/store/useAppStore', () => ({
  useAppStore: vi.fn(),
}))

vi.mock('@/hooks/use-is-client', () => ({
  useIsClient: vi.fn(),
}))

const mockedUseAppStore = vi.mocked(useAppStore)
const mockedUseIsClient = vi.mocked(useIsClient)

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hides persisted cart and auth state before hydration', () => {
    mockedUseIsClient.mockReturnValue(false)
    mockedUseAppStore.mockReturnValue({
      getCartCount: () => 3,
      user: { firstName: 'Ana', lastName: 'Dupont', role: 'user' },
      isAuthenticated: true,
      logout: vi.fn(),
      searchProducts: vi.fn(),
      setCurrentPage: vi.fn(),
    } as any)

    render(<Navbar />)

    expect(screen.queryByText(/panier \(3\)/i)).toBeNull()
    expect(screen.queryByText(/ana dupont/i)).toBeNull()
    expect(screen.getAllByText(/connexion/i).length).toBeGreaterThan(0)
  })
})
