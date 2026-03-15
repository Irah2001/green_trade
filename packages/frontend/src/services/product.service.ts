const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gt_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

export const productService = {
  async getProducts(params?: SearchParams): Promise<{ items: any[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.text) searchParams.set('text', params.text);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.minPrice !== undefined) searchParams.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) searchParams.set('maxPrice', String(params.maxPrice));
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const response = await fetch(`${API_URL}/api/products?${searchParams}`);
    if (!response.ok) throw new Error('Erreur lors du chargement des produits');
    return response.json();
  },

  async getProductById(id: string): Promise<any> {
    const response = await fetch(`${API_URL}/api/products/${id}`);
    if (!response.ok) throw new Error('Produit non trouvé');
    return response.json();
  },

  async createProduct(data: ProductPayload): Promise<any> {
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Erreur lors de la création');
    return json;
  },

  async updateProduct(id: string, data: Partial<ProductPayload>): Promise<any> {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Erreur lors de la mise à jour');
    return json;
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
  },
};
