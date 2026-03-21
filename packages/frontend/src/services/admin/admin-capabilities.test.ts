import { describe, expect, it } from 'vitest'
import { getAdminCapabilityLabel, ADMIN_CAPABILITIES } from './admin-capabilities'

describe('getAdminCapabilityLabel', () => {
  it('returns an explicit message for unsupported destructive actions', () => {
    expect(getAdminCapabilityLabel('orders', 'delete')).toMatch(/indisponible/i)
  })

  it('returns an explicit message for unsupported create action', () => {
    expect(getAdminCapabilityLabel('orders', 'create')).toMatch(/indisponible/i)
  })

  it('returns "Disponible" when capability is true', () => {
    // Temporarily check the shape - if any capability is true it should say Disponible
    const resources = ['orders', 'users', 'products'] as const
    const actions = ['list', 'detail', 'create', 'update', 'delete'] as const
    for (const resource of resources) {
      for (const action of actions) {
        const label = getAdminCapabilityLabel(resource, action)
        if (ADMIN_CAPABILITIES[resource][action]) {
          expect(label).toBe('Disponible')
        } else {
          expect(label).toMatch(/indisponible/i)
        }
      }
    }
  })
})
