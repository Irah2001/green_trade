import { describe, expect, it } from 'vitest'
import { NAV_ITEMS } from '@/components/layout/settings-nav'

describe('SettingsSidebar', () => {
  it('includes an orders entry', () => {
    expect(NAV_ITEMS.some((item) => item.href === '/settings/orders')).toBe(true)
  })
})
