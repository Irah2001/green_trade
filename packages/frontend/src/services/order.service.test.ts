import { describe, expect, it } from 'vitest'
import { getOrderRoleLabel, getOrderStatusMeta, normalizeOrderRow } from './order.service'

describe('normalizeOrderRow', () => {
  it('uses the provided product image and falls back for missing nested data', () => {
    const order = normalizeOrderRow({
      id: 'order-1',
      buyer: null,
      seller: null,
      product: {
        images: ['/images/poires.webp'],
      },
      amount: 12.5,
      quantity: 2,
      status: 'pending',
      createdAt: '2026-03-21T10:00:00.000Z',
    })

    expect(order.productTitle).toBe('—')
    expect(order.productImage).toBe('/images/poires.webp')
    expect(order.buyerLabel).toBe('—')
    expect(order.sellerLabel).toBe('—')
  })
})

describe('getOrderStatusMeta', () => {
  it('maps shipped orders to a violet badge', () => {
    const meta = getOrderStatusMeta('shipped')

    expect(meta.label).toBe('Expédiée')
    expect(meta.className).toContain('violet')
  })

  it('maps confirmed orders to a blue badge', () => {
    const meta = getOrderStatusMeta('confirmed')

    expect(meta.label).toBe('Confirmée')
    expect(meta.className).toContain('blue')
  })
})

describe('getOrderRoleLabel', () => {
  it('labels the current user as buyer when ids match the buyer', () => {
    expect(
      getOrderRoleLabel(
        { buyerId: 'user-1', sellerId: 'seller-1' },
        'user-1'
      )
    ).toBe('Acheteur')
  })
})
