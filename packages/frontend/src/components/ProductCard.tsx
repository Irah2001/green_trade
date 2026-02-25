"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, Share2, ShoppingBasket } from "lucide-react";
import { useState } from "react";

import type { Product } from "@/lib/mockData";

export default function ProductCard({ product }: Readonly<{ product: Product }>) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="relative flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] hover-scale group overflow-hidden border border-gray-100/50">
      {/* Badges & Actions Absolute */}
      <div className="absolute top-3 w-full px-3 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1.5 align-start">
          {product.tags.includes("surplus") && (
            <span className="bg-accent/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
              Surplus du jour
            </span>
          )}
          {product.tags.includes("bio") && (
            <span className="bg-olive/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm w-max">
              100% Bio
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }} 
            className="p-1.5 bg-white/80 backdrop-blur-md text-gray-700 rounded-full hover:bg-white transition-all shadow-sm"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-accent text-accent" : ""}`} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); /* Share Action */ }} 
            className="p-1.5 bg-white/80 backdrop-blur-md text-gray-700 rounded-full hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        {/* Image wrapper */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-1">
              {product.title}
            </h3>
            <span className="font-bold text-olive text-lg whitespace-nowrap">
              {product.price.toFixed(2)}€<span className="text-xs text-gray-400 font-medium">/{product.unit}</span>
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-3 gap-1">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span className="line-clamp-1">{product.location.city} • <span className="opacity-75">{product.location.distance}k</span></span>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="text-xs font-medium text-olive bg-light-green/20 px-2.5 py-1 rounded-md">
              Disponible {product.availableQuantity} {product.unit}
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <button className="w-full flex items-center justify-center gap-2 bg-olive text-white font-medium py-2.5 rounded-xl hover:bg-olive/90 transition-colors shadow-sm focus:ring-4 focus:ring-olive/20 outline-none">
          <ShoppingBasket className="w-4 h-4" />
          Ajouter
        </button>
      </div>
    </div>
  );
}
