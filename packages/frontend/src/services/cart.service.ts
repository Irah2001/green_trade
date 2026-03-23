// src/services/cart.service.ts
import { apiFetch } from '@/services/api';
import { normalizeProduct } from './product.service';

type CartItemPayload = {
  productId: string;
  quantity: number;
};

export const normalizeCartResponse = (cart: any) => ({
  ...cart,
  items: Array.isArray(cart?.items)
    ? cart.items.map((item: any) => ({
        ...item,
        product: normalizeProduct(item.product),
      }))
    : [],
});

/**
 * Service gérant le panier utilisateur.
 * Toutes les requêtes sont automatiquement authentifiées par apiFetch.
 */
export const cartService = {
  /**
   * Récupère le contenu du panier actuel.
   */
  async getCart() {
    const cart = await apiFetch<any>('/api/cart');
    return normalizeCartResponse(cart);
  },

  /**
   * Ajoute un produit au panier.
   */
  async addItem(payload: CartItemPayload) {
    const cart = await apiFetch<any>('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeCartResponse(cart);
  },

  /**
   * Met à jour la quantité d'un produit spécifique.
   */
  async updateItem(productId: string, quantity: number) {
    const cart = await apiFetch<any>(`/api/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    return normalizeCartResponse(cart);
  },

  /**
   * Supprime un produit du panier.
   */
  async removeItem(productId: string) {
    const cart = await apiFetch<any>(`/api/cart/items/${productId}`, {
      method: 'DELETE',
    });
    return normalizeCartResponse(cart);
  },

  /**
   * Vide l'intégralité du panier.
   */
  async clearCart() {
    const cart = await apiFetch<any>('/api/cart', {
      method: 'DELETE',
    });
    return normalizeCartResponse(cart);
  },
};
