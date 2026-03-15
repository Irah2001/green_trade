'use client';

import { useEffect, useState } from 'react';

// Components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePage from '@/components/pages/HomePage';
import ProductsPage from '@/components/pages/ProductsPage';
import CartPage from '@/components/pages/CartPage';
import PublishPage from '@/components/pages/PublishPage';
import AdminDashboard from '@/components/pages/AdminDashboard';
import ProductDetail from '@/components/product/ProductDetail';

import { useAppStore } from '@/store/useAppStore';
import { productService } from '@/services/product.service';
import type { Product } from '@/data/mockDatabase';

const FALLBACK_IMAGE = '/images/green_trade.webp';

function toProduct(raw: any): Product {
  return {
    id: raw.id ?? '',
    sellerId: raw.sellerId ?? '',
    title: raw.title ?? '',
    description: raw.description ?? '',
    price: Number(raw.price ?? 0),
    unit: raw.unit ?? 'unité',
    category: ['fruits', 'vegetables', 'baskets'].includes(raw.category) ? raw.category : 'baskets',
    organic: raw.organic ?? false,
    images: raw.images?.length ? raw.images : [FALLBACK_IMAGE],
    location: { city: raw.location?.city ?? '', postalCode: raw.location?.postalCode ?? '', coordinates: raw.location?.coordinates ?? [0, 0] },
    status: raw.status ?? 'active',
    quantity: raw.quantity ?? 0,
    tags: raw.tags ?? [],
    views: raw.views ?? 0,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
    isSurplusOfDay: false,
  };
}

// Custom hook to handle hydration
function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

export default function Home() {
  const currentPage = useAppStore((state) => state.currentPage);
  const selectedProductId = useAppStore((state) => state.selectedProductId);
  const setSelectedProduct = useAppStore((state) => state.setSelectedProduct);
  const loadProducts = useAppStore((state) => state.loadProducts);
  const productsLoading = useAppStore((state) => state.productsLoading);
  const products = useAppStore((state) => state.products);
  const isHydrated = useHydration();
  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);

  // Charger les produits + restaurer la page depuis l'URL à l'hydratation
  useEffect(() => {
    if (!isHydrated) return;
    loadProducts();
    const path = window.location.pathname;
    if (path.startsWith('/products/')) {
      const id = path.split('/products/')[1];
      if (id) {
        useAppStore.getState().setSelectedProduct(id);
        useAppStore.getState().setCurrentPage('product-detail');
      }
    } else if (path === '/products') {
      useAppStore.getState().setCurrentPage('products');
    }
  }, [isHydrated]);

  // Synchroniser l'URL avec la navigation SPA
  useEffect(() => {
    if (!isHydrated) return;
    if (currentPage === 'products') {
      window.history.pushState(null, '', '/products');
    } else if (currentPage === 'product-detail' && selectedProductId) {
      window.history.pushState(null, '', `/products/${selectedProductId}`);
    } else if (currentPage === 'home') {
      window.history.pushState(null, '', '/');
    }
  }, [currentPage, selectedProductId, isHydrated]);

  // Get selected product from store, or fall back to directly fetched one
  const selectedProduct = selectedProductId
    ? (products.find(p => p.id === selectedProductId) ?? fetchedProduct)
    : null;

  // When product not found in store and not loading, fetch it directly from API
  useEffect(() => {
    if (currentPage !== 'product-detail' || !selectedProductId) {
      setFetchedProduct(null);
      return;
    }
    if (products.find(p => p.id === selectedProductId)) {
      setFetchedProduct(null);
      return;
    }
    if (productsLoading) return;
    productService.getProductById(selectedProductId)
      .then(raw => setFetchedProduct(toProduct(raw)))
      .catch(() => setFetchedProduct(null));
  }, [selectedProductId, currentPage, products, productsLoading]);

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'product-detail':
        if (selectedProduct) {
          return (
            <ProductDetail
              product={selectedProduct}
              onBack={() => {
                setSelectedProduct(null);
                useAppStore.getState().setCurrentPage('products');
              }}
            />
          );
        }
        // Still loading — show skeleton instead of flashing products page
        if (productsLoading || (selectedProductId && !fetchedProduct)) {
          return (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="bg-white rounded-3xl h-[500px] animate-pulse border border-gray-100" />
            </div>
          );
        }
        return <ProductsPage />;
      case 'cart':
        return <CartPage />;
      case 'publish':
        return <PublishPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4A7C59] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#4A7C59] font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
