// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import * as React from 'react'

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

type Props = { children?: React.ReactNode }

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: Props) => <div data-slot="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: Props) => <>{children}</>,
  DropdownMenuContent: ({ children }: Props) => <div data-testid="dropdown-menu-content">{children}</div>,
  DropdownMenuLabel: ({ children }: Props) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuItem: ({ children, ...props }: Props) => <div {...props}>{children}</div>,
}))

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: Props) => <div data-slot="sheet">{children}</div>,
  SheetTrigger: ({ children }: Props) => <>{children}</>,
  SheetClose: ({ children }: Props) => <>{children}</>,
  SheetContent: ({ children }: Props) => <div data-testid="sheet-content">{children}</div>,
  SheetHeader: ({ children }: Props) => <div>{children}</div>,
  SheetTitle: ({ children }: Props) => <h2>{children}</h2>,
  SheetDescription: ({ children }: Props) => <p>{children}</p>,
  SheetFooter: ({ children }: Props) => <div>{children}</div>,
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
      user: { firstName: 'Ana', lastName: 'Dupont', role: 'buyer' },
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

  it('shows the seller listings entry in both menus for sellers', () => {
    mockedUseIsClient.mockReturnValue(true)
    mockedUseAppStore.mockReturnValue({
      getCartCount: () => 0,
      user: { firstName: 'Camille', lastName: 'Durand', role: 'seller' },
      isAuthenticated: true,
      logout: vi.fn(),
      searchProducts: vi.fn(),
      setCurrentPage: vi.fn(),
    } as any)

    render(<Navbar />)

    expect(within(screen.getByTestId('dropdown-menu-content')).getByText(/mes annonces/i)).not.toBeNull()
    expect(within(screen.getByTestId('sheet-content')).getByText(/mes annonces/i)).not.toBeNull()
  })
})
