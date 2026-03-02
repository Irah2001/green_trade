import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Product, User, CartItem, Order, mockUsers, mockProducts, mockOrders } from '@/data/mockDatabase'; 

import { authService } from '@/services/auth.service';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  
  // Products
  products: Product[];
  filteredProducts: Product[];
  setFilteredProducts: (products: Product[]) => void;
  searchProducts: (query: string) => void;
  filterByCategory: (category: string | null) => void;
  filterByPrice: (min: number, max: number) => void;
  filterByOrganic: (organic: boolean | null) => void;
  
  // Orders
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  
  // UI State
  currentPage: 'home' | 'products' | 'product-detail' | 'cart' | 'publish' | 'admin';
  selectedProductId: string | null;
  setCurrentPage: (page: 'home' | 'products' | 'product-detail' | 'cart' | 'publish' | 'admin') => void;
  setSelectedProduct: (productId: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const { user, token } = await authService.login({ email, password });

          localStorage.setItem('gt_token', token);
          
          set({ 
            user, 
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error: any) {
          return { success: false, message: error.message };
        }
      },

      signup: async (userData) => {
        try {
          const { user, token } = await authService.signup(userData);

          localStorage.setItem('gt_token', token);

          set({ 
            user, 
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error: any) {
          return { success: false, message: error.message };
        }
      },

      logout: () => {
        localStorage.removeItem('gt_token');
        set({ user: null, isAuthenticated: false, cart: [] });
      },

      // Cart State
      cart: [],
      
      addToCart: (product: Product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.productId === product.id);
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            cart: [...cart, { productId: product.id, quantity, product }],
          });
        }
      },
      
      removeFromCart: (productId: string) => {
        set({ cart: get().cart.filter(item => item.productId !== productId) });
      },
      
      updateCartQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => set({ cart: [] }),
      
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
      
      // Products State
      products: mockProducts.filter(p => p.status === 'active'),
      filteredProducts: mockProducts.filter(p => p.status === 'active'),
      
      setFilteredProducts: (products: Product[]) => set({ filteredProducts: products }),
      
      searchProducts: (query: string) => {
        const lowerQuery = query.toLowerCase();
        const filtered = get().products.filter(
          product =>
            product.title.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery) ||
            product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            product.location.city.toLowerCase().includes(lowerQuery)
        );
        set({ filteredProducts: filtered });
      },
      
      filterByCategory: (category: string | null) => {
        if (!category) {
          set({ filteredProducts: get().products });
          return;
        }
        set({
          filteredProducts: get().products.filter(p => p.category === category),
        });
      },
      
      filterByPrice: (min: number, max: number) => {
        set({
          filteredProducts: get().products.filter(
            p => p.price >= min && p.price <= max
          ),
        });
      },
      
      filterByOrganic: (organic: boolean | null) => {
        if (organic === null) {
          set({ filteredProducts: get().products });
          return;
        }
        set({
          filteredProducts: get().products.filter(p => p.organic === organic),
        });
      },
      
      // Orders State
      orders: mockOrders,
      
      createOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `order-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ orders: [...get().orders, newOrder] });
      },
      
      // UI State
      currentPage: 'home',
      selectedProductId: null,
      
      setCurrentPage: (page) => set({ currentPage: page }),
      setSelectedProduct: (productId) => set({ selectedProductId: productId }),
    }),
    {
      name: 'green-trade-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
