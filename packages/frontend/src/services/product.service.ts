// src/services/product.service.ts
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

/**
 * Service gérant les produits.
 * Utilise apiFetch pour supporter le SSR (Server Components) et le Client-side.
 */
export const productService = {
  /**
   * Récupère la liste des produits avec filtres optionnels.
   */
  async getProducts(params?: SearchParams): Promise<{ items: any[]; total: number }> {
    // Construction de la query string (ex: ?category=vetements&minPrice=10)
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