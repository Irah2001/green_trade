const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: {
    pending: number;
    paid: number;
    shipped: number;
    delivered: number;
  };
  recentOrders: Array<{
    id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    buyer: {
      firstName: string | null;
      lastName: string | null;
    };
    product: {
      title: string;
    };
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  city: string | null;
  rating: number | null;
  createdAt: string;
  isBanned?: boolean;
  banReason?: string | null;
  bannedAt?: string | null;
  profile: any;
}

export interface AdminOrder {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  amount: number;
  totalPrice: number;
  quantity: number;
  currency: string | null;
  status: string;
  trackingNumber: string | null;
  carrier: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  stripePaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  seller: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

export interface AdminProduct {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string | null;
  category: string;
  condition: string;
  images: string[];
  location: any;
  status: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminService = {
  /**
   * Récupérer les statistiques globales
   */
  async getStats(token: string): Promise<AdminStats> {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des statistiques');
    }

    return response.json();
  },

  /**
   * Récupérer tous les utilisateurs avec pagination
   */
  async getUsers(
    token: string, 
    options?: { 
      page?: number; 
      limit?: number; 
      role?: string; 
      search?: string;
    }
  ): Promise<{ users: AdminUser[]; pagination: any }> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.role) params.append('role', options.role);
    if (options?.search) params.append('search', options.search);

    const response = await fetch(
      `${API_URL}/api/admin/users${params.toString() ? `?${params}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des utilisateurs');
    }

    return response.json();
  },

  /**
   * Récupérer toutes les commandes avec pagination
   */
  async getOrders(
    token: string,
    options?: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ): Promise<{ orders: AdminOrder[]; pagination: any }> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.status) params.append('status', options.status);

    const response = await fetch(
      `${API_URL}/api/admin/orders${params.toString() ? `?${params}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des commandes');
    }

    return response.json();
  },

  /**
   * Récupérer tous les produits avec pagination
   */
  async getProducts(
    token: string,
    options?: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ): Promise<{ products: AdminProduct[]; pagination: any }> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.status) params.append('status', options.status);

    const response = await fetch(
      `${API_URL}/api/admin/products${params.toString() ? `?${params}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des produits');
    }

    return response.json();
  },

  /**
   * Bannir ou débannir un utilisateur
   */
  async banUser(
    token: string,
    userId: string,
    isBanned: boolean,
    reason?: string
  ): Promise<{ message: string; user: AdminUser }> {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}/ban`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isBanned, reason })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors du bannissement');
    }

    return response.json();
  },

  /**
   * Nettoyage RGPD (supprimer comptes anonymisés expirés)
   */
  async rgpdCleanup(token: string, daysToKeep: number = 30): Promise<{ message: string; deletedCount: number }> {
    const response = await fetch(`${API_URL}/api/admin/rgpd/cleanup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ daysToKeep })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors du nettoyage RGPD');
    }

    return response.json();
  }
};
