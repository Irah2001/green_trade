'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Store
import { useAppStore } from '@/store/useAppStore';


interface ProductFiltersProps {
  onFilterChange?: () => void;
}

interface FilterContentProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  organicOnly: boolean;
  setOrganicOnly: (organic: boolean) => void;
  selectedDistance: number | null;
  setSelectedDistance: (dist: number | null) => void;
  maxPrice: number;
  onApply: () => void;
  onClear: () => void;
}

// Component defined outside the main component
function FilterContent ({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  organicOnly,
  setOrganicOnly,
  selectedDistance,
  setSelectedDistance,
  maxPrice,
  onApply,
  onClear,
}: Readonly<FilterContentProps>) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Catégorie</Label>
        <div className="flex flex-wrap gap-2">
          {['fruits', 'vegetables', 'baskets'].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={
                selectedCategory === cat
                  ? 'bg-[#4A7C59] hover:bg-[#3a6349] text-white'
                  : 'border-gray-300'
              }
            >
              {cat === 'fruits' && '🍎 Fruits'}
              {cat === 'vegetables' && '🥕 Légumes'}
              {cat === 'baskets' && '🧺 Paniers'}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Prix : {priceRange[0].toFixed(2)}€ - {priceRange[1].toFixed(2)}€
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={maxPrice}
          step={0.5}
          className="w-full"
        />
      </div>

      {/* Organic */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="organic"
            checked={organicOnly}
            onCheckedChange={(checked) => setOrganicOnly(checked as boolean)}
          />
          <Label htmlFor="organic" className="text-sm cursor-pointer">
            Produits biologiques uniquement
          </Label>
        </div>
      </div>

      {/* Distance */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Distance maximum</Label>
        <div className="flex flex-wrap gap-2">
          {[5, 10, 20, 50].map((km) => (
            <Button
              key={km}
              variant={selectedDistance === km ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDistance(selectedDistance === km ? null : km)}
              className={
                selectedDistance === km
                  ? 'bg-[#4A7C59] hover:bg-[#3a6349] text-white'
                  : 'border-gray-300'
              }
            >
              {km} km
            </Button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={onClear}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Effacer
        </Button>
        <Button
          onClick={onApply}
          className="flex-1 bg-[#4A7C59] hover:bg-[#3a6349] text-white"
        >
          Appliquer
        </Button>
      </div>
    </div>
  );
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const { setFilteredProducts, products } = useAppStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 100;

  const applyFilters = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (organicOnly) {
      filtered = filtered.filter((p) => p.organic);
    }

    setFilteredProducts(filtered);
    onFilterChange?.();
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, maxPrice]);
    setOrganicOnly(false);
    setSelectedDistance(null);
    setFilteredProducts(products);
  };

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#4A7C59]" />
            Filtres
          </h3>
          <FilterContent
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            organicOnly={organicOnly}
            setOrganicOnly={setOrganicOnly}
            selectedDistance={selectedDistance}
            setSelectedDistance={setSelectedDistance}
            maxPrice={maxPrice}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </div>
      </div>

      {/* Mobile Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#4A7C59]" />
              Filtres
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              organicOnly={organicOnly}
              setOrganicOnly={setOrganicOnly}
              selectedDistance={selectedDistance}
              setSelectedDistance={setSelectedDistance}
              maxPrice={maxPrice}
              onApply={applyFilters}
              onClear={clearFilters}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
