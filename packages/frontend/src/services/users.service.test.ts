import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiFetch } from '@/services/api';
import { getPublicUsersByIds } from '@/services/users.service';
import type { BackendUser } from '@/types/user';


vi.mock('@/services/api', () => ({
  apiFetch: vi.fn(),
}));

describe('getPublicUsersByIds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches each seller once and returns a map by id', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url: string) => {
      const id = url.split('/').pop() ?? 'unknown';

      return {
        id,
        email: `${id}@example.com`,
        firstName: id === 'seller-1' ? 'Camille' : 'Lucas',
        lastName: id === 'seller-1' ? 'Durand' : 'Martin',
        role: 'producer',
        city: id === 'seller-1' ? 'Nantes' : 'Lyon',
        createdAt: '2026-03-21T10:00:00.000Z',
      } as BackendUser;

    });

    const profiles = await getPublicUsersByIds(['seller-1', 'seller-2', 'seller-1']);

    expect(Object.keys(profiles)).toEqual(['seller-1', 'seller-2']);
    expect(profiles['seller-1'].firstName).toBe('Camille');

    expect(profiles['seller-2'].city).toBe('Lyon');
    expect(vi.mocked(apiFetch)).toHaveBeenCalledTimes(2);
  });
});
