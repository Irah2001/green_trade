import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMocks = vi.hoisted(() => ({
  product: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  cart: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  cartItem: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

vi.mock('../prismaClient.js', () => ({
  default: prismaMocks,
}));

import { CartPrismaRepository } from './CartPrismaRepository.js';
import ProductPrismaRepository from './ProductPrismaRepository.js';

describe('ProductPrismaRepository seller serialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('attaches a public seller summary to product payloads', async () => {
    prismaMocks.product.findUnique.mockResolvedValue({
      id: 'product-1',
      sellerId: 'seller-1',
      title: 'Pommes bio',
      description: 'Panier de pommes fraîches',
      price: 12.5,
      currency: 'EUR',
      category: 'fruits',
      condition: 'bon',
      images: ['/images/pommes.webp'],
      location: {
        type: 'Point',
        coordinates: [1.1, 2.2],
        city: 'Angers',
        postalCode: '49000',
      },
      status: 'active',
      quantity: 4,
      unit: 'kg',
      tags: ['bio'],
      views: 7,
      createdAt: '2026-03-21T10:00:00.000Z',
      updatedAt: '2026-03-21T10:00:00.000Z',
      seller: {
        id: 'seller-1',
        firstName: 'Camille',
        lastName: 'Durand',
        email: 'camille@example.com',
        city: 'Angers',
        postalCode: '49000',
        profile: {
          avatar: '/avatars/camille.png',
          bio: 'Productrice locale',
          phone: '+33600000001',
          address: '12 rue des Fleurs',
        },
      },
    });

    const repository = new ProductPrismaRepository();
    const product = await repository.findById('product-1');

    expect(product).not.toBeNull();
    expect(product?.toJSON().seller).toMatchObject({
      id: 'seller-1',
      displayName: 'Camille Durand',
      avatar: '/avatars/camille.png',
      city: 'Angers',
      postalCode: '49000',
    });
    expect(product?.toJSON().seller?.profile).toMatchObject({
      avatar: '/avatars/camille.png',
      bio: 'Productrice locale',
    });
    expect(product?.toJSON().seller?.profile).not.toHaveProperty('phone');
    expect(product?.toJSON().seller?.profile).not.toHaveProperty('address');
  });
});

describe('CartPrismaRepository seller serialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes the seller summary on cart products', async () => {
    prismaMocks.cart.findUnique.mockResolvedValue({
      id: 'cart-1',
      userId: 'buyer-1',
      items: [
        {
          id: 'cart-item-1',
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 2,
          unitPriceSnapshot: 12.5,
          product: {
            id: 'product-1',
            sellerId: 'seller-1',
            title: 'Pommes bio',
            description: 'Panier de pommes fraîches',
            price: 12.5,
            currency: 'EUR',
            category: 'fruits',
            condition: 'bon',
            images: ['/images/pommes.webp'],
            location: {
              type: 'Point',
              coordinates: [1.1, 2.2],
              city: 'Angers',
              postalCode: '49000',
            },
            status: 'active',
            quantity: 4,
            unit: 'kg',
            tags: ['bio'],
            views: 7,
            createdAt: '2026-03-21T10:00:00.000Z',
            updatedAt: '2026-03-21T10:00:00.000Z',
            seller: {
              id: 'seller-1',
              firstName: 'Camille',
              lastName: 'Durand',
              email: 'camille@example.com',
              city: 'Angers',
              postalCode: '49000',
              profile: {
                avatar: '/avatars/camille.png',
                bio: 'Productrice locale',
                phone: '+33600000001',
                address: '12 rue des Fleurs',
              },
            },
          },
        },
      ],
    });

    const repository = new CartPrismaRepository();
    const cart = await repository.getCart('buyer-1');

    expect(cart?.items[0].product.seller).toMatchObject({
      id: 'seller-1',
      displayName: 'Camille Durand',
      avatar: '/avatars/camille.png',
      city: 'Angers',
    });
    expect(cart?.items[0].product.seller?.profile).toMatchObject({
      avatar: '/avatars/camille.png',
      bio: 'Productrice locale',
    });
    expect(cart?.items[0].product.seller?.profile).not.toHaveProperty('phone');
    expect(cart?.items[0].product.seller?.profile).not.toHaveProperty('address');
  });
});
