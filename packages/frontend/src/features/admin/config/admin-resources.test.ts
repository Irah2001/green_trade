import { describe, expect, it } from 'vitest'
import { ADMIN_RESOURCES } from './admin-resources'

describe('ADMIN_RESOURCES', () => {
  it('defines URL paths for orders, users, and products', () => {
    expect(ADMIN_RESOURCES.orders.href).toBe('/admin/orders')
    expect(ADMIN_RESOURCES.users.href).toBe('/admin/users')
    expect(ADMIN_RESOURCES.products.href).toBe('/admin/products')
  })

  it('defines labels for each resource', () => {
    expect(ADMIN_RESOURCES.orders.label).toBeDefined()
    expect(ADMIN_RESOURCES.users.label).toBeDefined()
    expect(ADMIN_RESOURCES.products.label).toBeDefined()
  })

  it('each resource has a key matching its own name', () => {
    expect(ADMIN_RESOURCES.orders.key).toBe('orders')
    expect(ADMIN_RESOURCES.users.key).toBe('users')
    expect(ADMIN_RESOURCES.products.key).toBe('products')
  })
})
