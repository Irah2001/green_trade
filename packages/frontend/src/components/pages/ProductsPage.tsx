'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Grid3X3, List } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Component
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/product/ProductFilters';

import type { Product } from '@/types/models';
import { useAppStore } from '@/store/useAppStore';

const categoryLabels: Record<string, string> = {
  fruits: '🍎 Fruits',
  vegetables: '🥕 Légumes',
  baskets: '🧺 Paniers',
};

export default function ProductsPage() {
  const { filteredProducts, searchProducts, setSelectedProduct, setCurrentPage, filterByCategory, selectedCategory } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const displayProducts = useMemo(() => {
    let sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product.id);
    setCurrentPage('product-detail');
  };

  const categories = ['fruits', 'vegetables', 'baskets'];

  const renderProductList = () => {
    if (displayProducts.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500 mb-4">
            Essayez de modifier vos filtres ou votre recherche
          </p>
          <Button
            onClick={() => {
              filterByCategory(null);
              searchProducts('');
            }}
            className="bg-olive hover:bg-olive-dark text-white"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {displayProducts.map((product) => {
          let categoryEmoji = '🧺';
          if (product.category === 'fruits') {
            categoryEmoji = '🍎';
          } else if (product.category === 'vegetables') {
            categoryEmoji = '🥕';
          }

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => handleProductClick(product)}
              className="flex w-full gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer text-left transition-shadow"
            >
              <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 truncate">{product.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {categoryEmoji} {product.category}
                  </Badge>
                  <span className="text-xs text-gray-400">{product.location.city}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-olive">{product.price.toFixed(2)}€</p>
                <p className="text-xs text-gray-500">/{product.unit}</p>
                <Button size="sm" className="mt-2 bg-olive hover:bg-olive-dark text-white rounded-full">
                  Ajouter
                </Button>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {selectedCategory ? categoryLabels[selectedCategory] ?? 'Tous les produits' : 'Tous les produits'}
        </h1>
        <p className="text-gray-600">
          {displayProducts.length} produit{displayProducts.length > 1 ? 's' : ''} disponible{displayProducts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form action={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full"
            />
          </div>
        </form>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 rounded-full">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="name">Nom A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden sm:flex border rounded-full overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => filterByCategory(null)}
          className="rounded-full"
        >
          Tous
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            onClick={() => filterByCategory(cat)}
            className="rounded-full"
          >
            {cat === 'fruits' && '🍎 Fruits'}
            {cat === 'vegetables' && '🥕 Légumes'}
            {cat === 'baskets' && '🧺 Paniers'}
          </Button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Filters - Desktop */}
        <ProductFilters />

        {/* Product Grid */}
        <div className="flex-1">
          {renderProductList()}
        </div>
      </div>
    </div>
  );
}
