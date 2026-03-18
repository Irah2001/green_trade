"use client";

import { useState } from "react";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { mockProducts as MOCK_PRODUCTS } from "@/data/mockDatabase";

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const categories = ["Tous", "Fruits", "Légumes", "Paniers Anti-Gaspi"];
  const distances = ["< 2km", "< 5km", "< 10km", "Toutes distances"];

  return (
    <div className="bg-off-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Récoltes disponibles</h1>
            <p className="text-gray-500 mt-2 text-sm mt-1">Trouvez les meilleurs produits frais autour de vous</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 md:hidden w-full justify-center"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span>Trier par:</span>
              <button className="flex items-center gap-1 font-semibold text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                Date <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-olive font-bold pb-2 border-b border-gray-50">
                <SlidersHorizontal className="w-5 h-5" />
                <h2>Filtres</h2>
              </div>

              {/* Catégories */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Catégories</h3>
                <div className="space-y-2.5">
                  {categories.map((cat, i) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${i === 0 ? 'bg-olive border-olive' : 'border-gray-300 group-hover:border-olive'}`}>
                        {i === 0 && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className={`text-sm ${i === 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Distance Max</h3>
                <div className="space-y-2.5">
                  {distances.map((dist, i) => (
                    <label key={dist} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-olive flex items-center justify-center">
                        {i === 2 && <div className="w-2 h-2 bg-olive rounded-full" />}
                      </div>
                      <span className="text-sm text-gray-600">{dist}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags / Options */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Caractéristiques</h3>
                <label className="flex items-start gap-3 cursor-pointer group mb-2">
                  <div className="mt-0.5 w-4 h-4 rounded border border-gray-300 group-hover:border-olive" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">100% Bio</span>
                    <span className="text-xs text-gray-500">Sans aucun pesticide</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5 w-4 h-4 rounded border border-gray-300 group-hover:border-olive bg-olive border-olive flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">Surplus du jour</span>
                    <span className="text-xs text-gray-500">Récolté aujourd&apos;hui</span>
                  </div>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                Charger plus de produits
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
