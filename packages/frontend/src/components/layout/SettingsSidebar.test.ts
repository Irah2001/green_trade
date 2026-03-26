import { describe, expect, it } from 'vitest'
import { getSettingsNavItems, NAV_ITEMS } from '@/components/layout/settings-nav'

describe('SettingsSidebar', () => {
  it('includes an orders entry', () => {
    expect(NAV_ITEMS.some((item) => item.href === '/settings/orders')).toBe(true)
  })

  it('shows seller listings only for sellers', () => {
    expect(getSettingsNavItems('buyer' as any).some((item) => item.href === '/settings/listings')).toBe(false)
    expect(getSettingsNavItems('seller' as any).some((item) => item.href === '/settings/listings')).toBe(true)
  })
})
