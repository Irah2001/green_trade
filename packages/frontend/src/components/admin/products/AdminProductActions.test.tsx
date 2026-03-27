// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import AdminProductActions from './AdminProductActions'
import { deleteAdminProduct } from '@/services/admin/products.service'

const push = vi.fn()
const refresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}))

vi.mock('@/services/admin/products.service', () => ({
  deleteAdminProduct: vi.fn(),
}))

const mockedDeleteAdminProduct = vi.mocked(deleteAdminProduct)

describe('AdminProductActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => true))
    vi.stubGlobal('alert', vi.fn())
  })

  it('renders a delete button next to back and edit actions', () => {
    render(<AdminProductActions productId="product-1" productTitle="Pommes bio" />)

    expect(screen.getByRole('link', { name: /retour/i })).not.toBeNull()
    expect(screen.getByRole('link', { name: /modifier/i })).not.toBeNull()
    expect(screen.getByRole('button', { name: /supprimer/i })).not.toBeNull()
  })

  it('deletes the product and returns to the list', async () => {
    mockedDeleteAdminProduct.mockResolvedValue({ data: null, source: 'api' } as any)

    render(<AdminProductActions productId="product-1" productTitle="Pommes bio" />)

    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

    await waitFor(() => {
      expect(mockedDeleteAdminProduct).toHaveBeenCalledWith('product-1')
      expect(push).toHaveBeenCalledWith('/admin/products')
      expect(refresh).toHaveBeenCalled()
    })
  })
})
