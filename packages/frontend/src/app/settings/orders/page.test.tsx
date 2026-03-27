// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import OrdersSettingsPage from './page'
import { orderService } from '@/services/order.service'
import { useAppStore } from '@/store/useAppStore'

vi.mock('@/services/order.service', () => ({
  orderService: {
    getMyOrders: vi.fn(),
  },
  getOrderStatusMeta: () => ({ label: 'En attente', className: '' }),
  getOrderRoleLabel: () => 'Acheteur',
}))



const mockedOrderService = vi.mocked(orderService)

describe('OrdersSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAppStore.setState({ isAuthenticated: false, user: null, cart: [] })
  })

  it('shows the login prompt when the user is not authenticated', () => {
    useAppStore.setState({ isAuthenticated: false, user: null })

    render(<OrdersSettingsPage />)

    expect(screen.getByText(/connectez-vous pour voir vos commandes/i)).not.toBeNull()
    expect(mockedOrderService.getMyOrders).not.toHaveBeenCalled()
  })

  it('shows the empty state when no orders are returned', async () => {
    useAppStore.setState({ isAuthenticated: true, user: { id: 'user-1' } as any })
    mockedOrderService.getMyOrders.mockResolvedValue({ orders: [] } as any)

    render(<OrdersSettingsPage />)

    expect(await screen.findByText(/aucune commande/i)).not.toBeNull()
  })

  it('shows the loading state before the first authenticated fetch completes', async () => {
    useAppStore.setState({ isAuthenticated: true, user: { id: 'user-1' } as any })
    let resolveOrders: ((value: any) => void) | undefined
    mockedOrderService.getMyOrders.mockReturnValue(
      new Promise((resolve) => {
        resolveOrders = resolve
      }) as any
    )

    render(<OrdersSettingsPage />)

    expect(screen.queryByText(/aucune commande/i)).toBeNull()
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)

    resolveOrders?.({ orders: [] })
    await screen.findByText(/aucune commande/i)
  })

  it('ignores a late orders response after unmount', async () => {
    useAppStore.setState({ isAuthenticated: true, user: { id: 'user-1' } as any })
    let resolveOrders: ((value: any) => void) | undefined
    mockedOrderService.getMyOrders.mockReturnValue(
      new Promise((resolve) => {
        resolveOrders = resolve
      }) as any
    )
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { unmount } = render(<OrdersSettingsPage />)

    await waitFor(() => {
      expect(mockedOrderService.getMyOrders).toHaveBeenCalled()
    })

    unmount()

    await act(async () => {
      resolveOrders?.({ orders: [] })
      await Promise.resolve()
    })

    expect(consoleErrorSpy).not.toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('uses the primary green style for the detail button', async () => {
    useAppStore.setState({ isAuthenticated: true, user: { id: 'user-1' } as any })
    mockedOrderService.getMyOrders.mockResolvedValue({
      orders: [
        {
          id: 'order-1',
          productTitle: 'Tomates',
          productImage: '/tomates.jpg',
          amount: 12,
          quantity: 2,
          createdAt: '2026-03-21T10:00:00.000Z',
          status: 'pending',
          buyerId: 'buyer-1',
          sellerId: 'seller-1',
          buyerLabel: 'Alice',
          sellerLabel: 'Bob',
        },
      ],
    } as any)

    render(<OrdersSettingsPage />)

    const link = await screen.findByRole('link', { name: /voir détail/i })
    expect(link.className).toContain('bg-olive')
    expect(link.className).toContain('text-white')
    expect(link.className).toContain('hover:bg-olive-dark')
  })
})
