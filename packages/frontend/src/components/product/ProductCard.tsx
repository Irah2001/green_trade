'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart, Share2, MapPin, Check } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import SellerIdentity from '@/components/shared/seller-identity';

// Data
import type { Product } from '@/types/models';

// Store
import { useAppStore } from '@/store/useAppStore';

// Hooks
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: Readonly<ProductCardProps>) {
  const { addToCart } = useAppStore();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    toast({
      title: 'Ajouté au panier',
      description: `${product.title} a été ajouté à votre panier`,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris',
      description: isLiked
        ? `${product.title} a été retiré de vos favoris`
        : `${product.title} a été ajouté à vos favoris`,
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${globalThis.location.origin}/?product=${product.id}`);
    toast({
      title: 'Lien copié',
      description: 'Le lien du produit a été copié dans le presse-papier',
    });
  };

  return (
    <Card
      className="product-card overflow-hidden cursor-pointer border-none shadow-md hover:shadow-lg bg-white"
      onClick={() => onProductClick?.(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <Image
          src={product.images?.[0]}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isSurplusOfDay && (
            <Badge className="bg-[#E88D67] text-white text-xs px-2 py-1 badge-pulse">
              Surplus du jour
            </Badge>
          )}
          {product.organic && (
            <Badge className="bg-[#4A7C59] text-white text-xs px-2 py-1">
              <Check className="h-3 w-3 mr-1" />
              Bio
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Quantity badge */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
            {product.quantity} {product.unit} dispo.
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        {/* Seller info */}
        <div className="mb-2">
          <SellerIdentity seller={product.seller ?? null} fallbackCity={product.location.city} />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.title}</h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin className="h-3 w-3" />
          <span>{product.location.city}</span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xl font-bold text-[#4A7C59]">
              {product.price.toFixed(2)}€
            </span>
            <span className="text-gray-500 text-sm">/{product.unit}</span>
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-[#4A7C59] hover:bg-[#3a6349] text-white rounded-full px-4"
          >
            {isAdding ? (
              <Check className="h-4 w-4" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Ajouter
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
