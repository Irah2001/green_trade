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
import { mockProducts } from '@/data/mockDatabase';

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
  const isHydrated = useHydration();

  // Initialize products after hydration
  useEffect(() => {
    if (isHydrated) {
      useAppStore.setState({ 
        products: mockProducts.filter(p => p.status === 'active'),
        filteredProducts: mockProducts.filter(p => p.status === 'active')
      });
    }
  }, [isHydrated]);

  // Get selected product
  const selectedProduct = selectedProductId 
    ? mockProducts.find(p => p.id === selectedProductId) 
    : null;

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
