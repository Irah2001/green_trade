// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/store/useAppStore', () => ({
  useAppStore: () => ({ addToCart: vi.fn() }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

import ProductCard from '@/components/product/ProductCard';

describe('ProductCard', () => {
  it('renders the public seller identity instead of a generic label', () => {
    render(
      <ProductCard
        product={{
          id: 'product-1',
          sellerId: 'seller-1',
          seller: {
            id: 'seller-1',
            displayName: 'Camille Durand',
            city: 'Angers',
          },
          title: 'Pommes bio',
          description: 'Pommes fraîches',
          price: 12.5,
          unit: 'kg',
          category: 'fruits',
          organic: true,
          images: ['/images/pommes.webp'],
          location: {
            city: 'Angers',
            postalCode: '49000',
            coordinates: [1.1, 2.2],
          },
          status: 'active',
          quantity: 4,
          tags: ['bio'],
          views: 7,
          createdAt: '2026-03-21T10:00:00.000Z',
          updatedAt: '2026-03-21T10:00:00.000Z',
        }}
      />,
    );

    expect(screen.getByText('Camille Durand')).toBeDefined();
    expect(screen.getAllByText('Angers').length).toBeGreaterThan(0);
    expect(screen.queryByText(/Producteur local/i)).toBeNull();
  });
});
