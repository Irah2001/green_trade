// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

import ListingsSettingsPage from './page'
import { productService } from '@/services/product.service'
import { useAppStore } from '@/store/useAppStore'

vi.mock('@/services/product.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/product.service')>()
  return {
    ...actual,
    productService: {
      ...actual.productService,
      getProductsBySeller: vi.fn(),
      deleteProduct: vi.fn(),
    },
  }
})

vi.mock('@/store/useAppStore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/useAppStore')>()
  return {
    ...actual,
    useAppStore: actual.useAppStore,
  }
})

vi.mock('@/services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/api')>()
  return {
    ...actual,
    apiFetch: vi.fn(),
  }
})

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

const mockedProductService = vi.mocked(productService)

describe('ListingsSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAppStore.setState({ isAuthenticated: false, user: null, cart: [] })
  })

  it('shows the reserved access state for non sellers', () => {
    useAppStore.setState({ isAuthenticated: true, user: { id: 'user-1', role: 'buyer' } as any })

    render(<ListingsSettingsPage />)

    expect(screen.getByText(/accès réservé aux vendeurs/i)).not.toBeNull()
  })

  it('loads seller listings and shows the delete action', async () => {
    useAppStore.setState({ isAuthenticated: true, user: { id: 'seller-1', role: 'seller' } as any })
    mockedProductService.getProductsBySeller.mockResolvedValue({
      items: [
        {
          id: 'product-1',
          title: 'Pommes bio',
          price: 12,
          quantity: 5,
          status: 'active',
          organic: true,
          images: ['/pommes.jpg'],
          location: { city: 'Angers', postalCode: '49000', coordinates: [1, 2] },
          category: 'fruits',
          createdAt: '2026-03-21T10:00:00.000Z',
          sellerId: 'seller-1',
        },
      ],
      total: 1,
    } as any)

    render(<ListingsSettingsPage />)

    expect(await screen.findByText(/pommes bio/i)).not.toBeNull()
    expect(screen.getByRole('button', { name: /supprimer/i })).not.toBeNull()
  })

  it('requests seller products from the backend', async () => {
    useAppStore.setState({ isAuthenticated: true, user: { id: 'seller-1', role: 'seller' } as any })
    mockedProductService.getProductsBySeller.mockResolvedValue({ items: [], total: 0 } as any)

    render(<ListingsSettingsPage />)

    await waitFor(() => {
      expect(mockedProductService.getProductsBySeller).toHaveBeenCalledWith('seller-1', { limit: 100 })
    })
  })
})
