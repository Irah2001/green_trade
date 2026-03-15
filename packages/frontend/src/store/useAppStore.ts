import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Product, User, CartItem, Order, mockOrders } from '@/data/mockDatabase';

import { authService } from '@/services/auth.service';
import { cartService } from '@/services/cart.service';
import { productService, ProductPayload, SearchParams } from '@/services/product.service';

const FALLBACK_IMAGE = '/images/green_trade.webp';

const toFrontendProduct = (product: any): Product => ({
  id: product?.id ?? '',
  sellerId: product?.sellerId ?? '',
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

const mapCartItems = (cart: any): CartItem[] => {
  if (!cart?.items?.length) return [];
  return cart.items.map((item: any) => ({
    productId: item.productId,
    quantity: item.quantity,
    product: toFrontendProduct(item.product),
    unitPriceSnapshot: item.unitPriceSnapshot,
  }));
};

const isMongoObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Cart
  cart: CartItem[];
  loadCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Products
  products: Product[];
  filteredProducts: Product[];
  productsLoading: boolean;
  loadProducts: (params?: SearchParams) => Promise<void>;
  createProduct: (data: ProductPayload) => Promise<{ success: boolean; id?: string; message?: string }>;
  updateProduct: (id: string, data: Partial<ProductPayload>) => Promise<{ success: boolean; message?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; message?: string }>;
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
          await get().loadCart();
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
          await get().loadCart();
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

      loadCart: async () => {
        if (!get().isAuthenticated) return;
        try {
          const cart = await cartService.getCart();
          set({ cart: mapCartItems(cart) });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      },

      addToCart: async (product: Product, quantity = 1) => {
        if (!get().isAuthenticated || !isMongoObjectId(product.id)) {
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
          return;
        }

        try {
          const cart = await cartService.addItem({ productId: product.id, quantity });
          set({ cart: mapCartItems(cart) });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      },

      removeFromCart: async (productId: string) => {
        if (!get().isAuthenticated || !isMongoObjectId(productId)) {
          set({ cart: get().cart.filter(item => item.productId !== productId) });
          return;
        }

        try {
          const cart = await cartService.removeItem(productId);
          set({ cart: mapCartItems(cart) });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      },

      updateCartQuantity: async (productId: string, quantity: number) => {
        if (!get().isAuthenticated || !isMongoObjectId(productId)) {
          if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
          }
          set({
            cart: get().cart.map(item =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          });
          return;
        }

        try {
          const cart = await cartService.updateItem(productId, quantity);
          set({ cart: mapCartItems(cart) });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      },

      clearCart: async () => {
        if (!get().isAuthenticated) {
          set({ cart: [] });
          return;
        }

        try {
          const cart = await cartService.clearCart();
          set({ cart: mapCartItems(cart) });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      },

      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => (item.unitPriceSnapshot ?? item.product.price) * item.quantity + total,
          0
        );
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Products State
      products: [],
      filteredProducts: [],
      productsLoading: false,

      loadProducts: async (params?) => {
        set({ productsLoading: true });
        try {
          const { items } = await productService.getProducts(params);
          const mapped = items.map(toFrontendProduct);
          set({ products: mapped, filteredProducts: mapped });
        } catch {
          // Fallback sur mock data si l'API est indisponible
        } finally {
          set({ productsLoading: false });
        }
      },

      createProduct: async (data) => {
        try {
          const created = await productService.createProduct(data);
          const product = toFrontendProduct(created);
          set(state => ({ products: [product, ...state.products], filteredProducts: [product, ...state.filteredProducts] }));
          return { success: true, id: created.id };
        } catch (error: any) {
          return { success: false, message: error.message };
        }
      },

      updateProduct: async (id, data) => {
        try {
          const updated = await productService.updateProduct(id, data);
          const product = toFrontendProduct(updated);
          set(state => ({
            products: state.products.map(p => p.id === id ? product : p),
            filteredProducts: state.filteredProducts.map(p => p.id === id ? product : p),
          }));
          return { success: true };
        } catch (error: any) {
          return { success: false, message: error.message };
        }
      },

      deleteProduct: async (id) => {
        try {
          await productService.deleteProduct(id);
          set(state => ({
            products: state.products.filter(p => p.id !== id),
            filteredProducts: state.filteredProducts.filter(p => p.id !== id),
          }));
          return { success: true };
        } catch (error: any) {
          return { success: false, message: error.message };
        }
      },

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
