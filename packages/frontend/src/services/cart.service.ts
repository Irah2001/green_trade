const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type CartItemPayload = {
  productId: string;
  quantity: number;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('gt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const cartService = {
  async getCart() {
    const response = await fetch(`${API_URL}/api/cart`, {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erreur lors du chargement du panier');
    }
    return response.json();
  },

  async addItem(payload: CartItemPayload) {
    const response = await fetch(`${API_URL}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erreur lors de l\'ajout au panier');
    }
    return response.json();
  },

  async updateItem(productId: string, quantity: number) {
    const response = await fetch(`${API_URL}/api/cart/items/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erreur lors de la mise à jour du panier');
    }
    return response.json();
  },

  async removeItem(productId: string) {
    const response = await fetch(`${API_URL}/api/cart/items/${productId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erreur lors de la suppression du produit');
    }
    return response.json();
  },

  async clearCart() {
    const response = await fetch(`${API_URL}/api/cart`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erreur lors du vidage du panier');
    }
    return response.json();
  },
};
