// src/services/cart.service.ts
import { apiFetch } from "./api";

type CartItemPayload = {
  productId: string;
  quantity: number;
};

/**
 * Service gérant le panier utilisateur.
 * Toutes les requêtes sont automatiquement authentifiées par apiFetch.
 */
export const cartService = {
  /**
   * Récupère le contenu du panier actuel.
   */
  async getCart() {
    return apiFetch<any>('/api/cart');
  },

  /**
   * Ajoute un produit au panier.
   */
  async addItem(payload: CartItemPayload) {
    return apiFetch<any>('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Met à jour la quantité d'un produit spécifique.
   */
  async updateItem(productId: string, quantity: number) {
    return apiFetch<any>(`/api/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  /**
   * Supprime un produit du panier.
   */
  async removeItem(productId: string) {
    return apiFetch<any>(`/api/cart/items/${productId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Vide l'intégralité du panier.
   */
  async clearCart() {
    return apiFetch<any>('/api/cart', {
      method: 'DELETE',
    });
  },
};