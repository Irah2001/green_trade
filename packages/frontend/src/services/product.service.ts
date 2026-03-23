// src/services/product.service.ts
import type { Product, SellerSummary } from '@/types/models';
import { apiFetch } from './api';

export type ProductPayload = {
  title: string;
  description: string;
  price: number;
  category: string;
  condition?: 'neuf' | 'excellent' | 'bon' | 'acceptable';
  images?: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    city?: string;
    postalCode?: string;
  };
  tags?: string[];
  status?: 'active' | 'sold' | 'reserved' | 'archived';
  quantity?: number;
  unit?: string;
};

export type SearchParams = {
  text?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
};

const FALLBACK_IMAGE = '/images/green_trade.webp';

export const normalizeSellerSummary = (seller: any): SellerSummary | null => {
  if (!seller) {
    return null;
  }

  const displayName = seller.displayName
    ?? `${seller.firstName ?? ''} ${seller.lastName ?? ''}`.trim();

  return {
    id: seller.id ?? '',
    displayName: displayName || seller.email || 'Vendeur',
    avatar: seller.avatar ?? seller.profile?.avatar ?? undefined,
    city: seller.city ?? seller.location?.city ?? undefined,
    postalCode: seller.postalCode ?? seller.location?.postalCode ?? undefined,
    profile: seller.profile
      ? {
          avatar: seller.profile.avatar,
          bio: seller.profile.bio,
          phone: seller.profile.phone,
          address: seller.profile.address,
        }
      : undefined,
  };
};

export const normalizeProduct = (product: any): Product => ({
  id: product?.id ?? '',
  sellerId: product?.sellerId ?? '',
  seller: normalizeSellerSummary(product?.seller),
  title: product?.title ?? '',
  description: product?.description ?? '',
  price: Number(product?.price ?? 0),
  unit: product?.unit ?? 'unité',
  category: ['fruits', 'vegetables', 'baskets'].includes(product?.category)
    ? product.category
    : 'baskets',
  organic: product?.organic ?? false,
  images: product?.images?.length ? product.images : [FALLBACK_IMAGE],
  location: product?.location?.city
    ? {
        city: product.location.city ?? '',
        postalCode: product.location.postalCode ?? '',
        coordinates: product.location.coordinates ?? [0, 0],
        distance: product.location.distance,
      }
    : { city: '', postalCode: '', coordinates: [0, 0] },
  status: product?.status ?? 'active',
  quantity: product?.quantity ?? 0,
  tags: product?.tags ?? [],
  views: product?.views ?? 0,
  createdAt: product?.createdAt ?? new Date().toISOString(),
  updatedAt: product?.updatedAt ?? new Date().toISOString(),
  isSurplusOfDay: product?.isSurplusOfDay ?? false,
});

/**
 * Service gérant les produits.
 * Utilise apiFetch pour supporter le SSR (Server Components) et le Client-side.
 */
export const productService = {
  /**
   * Récupère la liste des produits avec filtres optionnels.
   */
  async getProducts(params?: SearchParams): Promise<{ items: any[]; total: number }> {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== '')
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiFetch<{ items: any[]; total: number }>(`/api/products${queryString}`);
  },

  /**
   * Récupère un produit spécifique par son ID.
   */
  async getProductById(id: string): Promise<any> {
    return apiFetch<any>(`/api/products/${id}`);
  },

  /**
   * Crée un nouveau produit.
   */
  async createProduct(data: ProductPayload): Promise<any> {
    return apiFetch<any>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Met à jour un produit existant.
   */
  async updateProduct(id: string, data: Partial<ProductPayload>): Promise<any> {
    return apiFetch<any>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprime un produit.
   */
  async deleteProduct(id: string): Promise<void> {
    return apiFetch<void>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },
};
