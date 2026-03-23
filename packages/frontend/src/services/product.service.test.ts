import { describe, expect, it } from 'vitest';

import { normalizeProduct } from '@/services/product.service';
import { normalizeCartResponse } from '@/services/cart.service';

describe('normalizeProduct', () => {
  it('keeps the public seller summary from the API without synthesizing labels', () => {
    const product = normalizeProduct({
      id: 'product-1',
      sellerId: 'seller-1',
      title: 'Pommes bio',
      description: 'Pommes fraîches',
      price: 12.5,
      category: 'fruits',
      unit: 'kg',
      images: ['/images/pommes.webp'],
      location: {
        city: 'Angers',
        postalCode: '49000',
        coordinates: [1.1, 2.2],
      },
      seller: {
        id: 'seller-1',
        displayName: 'Camille Durand',
        avatar: '/avatars/camille.png',
        city: 'Angers',
        postalCode: '49000',
        profile: { bio: 'Productrice locale' },
      },
    });

    expect(product.seller?.displayName).toBe('Camille Durand');
    expect(product.seller?.avatar).toBe('/avatars/camille.png');
    expect(product.seller?.city).toBe('Angers');
  });
});

describe('normalizeCartResponse', () => {
  it('preserves seller identity on cart items', () => {
    const cart = normalizeCartResponse({
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          product: {
            id: 'product-1',
            sellerId: 'seller-1',
            title: 'Pommes bio',
            description: 'Pommes fraîches',
            price: 12.5,
            category: 'fruits',
            unit: 'kg',
            images: ['/images/pommes.webp'],
            location: {
              city: 'Angers',
              postalCode: '49000',
              coordinates: [1.1, 2.2],
            },
            seller: {
              id: 'seller-1',
              displayName: 'Camille Durand',
              avatar: '/avatars/camille.png',
              city: 'Angers',
            },
          },
        },
      ],
    });

    expect(cart.items[0].product.seller?.displayName).toBe('Camille Durand');
    expect(cart.items[0].product.seller?.city).toBe('Angers');
  });
});
