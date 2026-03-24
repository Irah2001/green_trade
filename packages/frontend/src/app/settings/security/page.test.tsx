// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import SecuritySettingsPage from './page'
import { useAppStore } from '@/store/useAppStore'
import { useIsClient } from '@/hooks/use-is-client'

vi.mock('@/store/useAppStore', () => ({
  useAppStore: vi.fn(),
}))

vi.mock('@/hooks/use-is-client', () => ({
  useIsClient: vi.fn(),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

const mockedUseAppStore = vi.mocked(useAppStore)
const mockedUseIsClient = vi.mocked(useIsClient)

describe('SecuritySettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds password autocomplete hints to security inputs', () => {
    mockedUseIsClient.mockReturnValue(true)
    mockedUseAppStore.mockReturnValue({ email: 'user@example.com' } as any)

    render(<SecuritySettingsPage />)

    expect(document.getElementById('currentPassword')?.getAttribute('autocomplete')).toBe('current-password')
    expect(document.getElementById('pwd-newPassword')?.getAttribute('autocomplete')).toBe('new-password')
  })
})
