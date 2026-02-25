'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ShoppingCart,
  Heart,
  Share2,
  MapPin,
  Star,
  Check,
  Minus,
  Plus,
  MessageCircle,
  Truck,
  Store,
  ArrowLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Product, mockUsers, mockProducts } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: Readonly<ProductDetailProps>) {
  const { addToCart } = useAppStore();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');

  const seller = mockUsers.find((u) => u.id === product.sellerId);
  
  // Get suggested products (same category, different product)
  const suggestedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === 'active')
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: 'Ajouté au panier',
      description: `${quantity} ${quantity > 1 ? 'unités' : 'unité'} de ${product.title} ajoutée(s) au panier`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    useAppStore.getState().setCurrentPage('cart');
    toast({
      title: 'Produit ajouté',
      description: 'Vous êtes redirigé vers le panier',
    });
  };

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="mb-6 text-gray-600">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux produits
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isSurplusOfDay && (
                <Badge className="bg-[#E88D67] text-white text-sm px-3 py-1">
                  🔥 Surplus du jour
                </Badge>
              )}
              {product.organic && (
                <Badge className="bg-[#4A7C59] text-white text-sm px-3 py-1">
                  <Check className="h-4 w-4 mr-1" />
                  Bio
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                onClick={() => {
                  navigator.clipboard.writeText(globalThis.location.href);
                  toast({ title: 'Lien copié !' });
                }}
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === index ? 'border-[#4A7C59]' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Seller */}
          {seller && (
            <div className="flex items-center gap-3">
              {seller.profile?.avatar && (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#A8D5BA]">
                  <Image
                    src={seller.profile.avatar}
                    alt={`${seller.firstName} ${seller.lastName}`}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium">
                  {seller.firstName} {seller.lastName}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{seller.rating?.toFixed(1)}</span>
                  <span className="mx-1">•</span>
                  <span>Producteur vérifié</span>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5 text-[#4A7C59]" />
            <span>{product.location.city}, {product.location.postalCode}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#4A7C59]">
              {product.price.toFixed(2)}€
            </span>
            <span className="text-gray-500 text-lg">/{product.unit}</span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#A8D5BA]/20 text-[#4A7C59]">
              {product.quantity} {product.unit} disponible{product.quantity > 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-gray-300">
                #{tag}
              </Badge>
            ))}
          </div>

          <Separator />

          {/* Delivery Method */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Mode de retrait</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={deliveryMethod === 'pickup' ? 'default' : 'outline'}
                onClick={() => setDeliveryMethod('pickup')}
                className={`h-auto py-4 ${
                  deliveryMethod === 'pickup'
                    ? 'bg-[#4A7C59] hover:bg-[#3a6349] text-white'
                    : 'border-gray-300'
                }`}
              >
                <Store className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <p className="font-medium">Retrait</p>
                  <p className="text-xs opacity-80">Chez le producteur</p>
                </div>
              </Button>
              <Button
                variant={deliveryMethod === 'delivery' ? 'default' : 'outline'}
                onClick={() => setDeliveryMethod('delivery')}
                className={`h-auto py-4 ${
                  deliveryMethod === 'delivery'
                    ? 'bg-[#4A7C59] hover:bg-[#3a6349] text-white'
                    : 'border-gray-300'
                }`}
              >
                <Truck className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <p className="font-medium">Livraison</p>
                  <p className="text-xs opacity-80">À domicile</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Quantité</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-full">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.quantity}
                  className="rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-gray-500">
                Total: <span className="font-bold text-[#4A7C59]">{totalPrice.toFixed(2)}€</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="flex-1 border-[#4A7C59] text-[#4A7C59] hover:bg-[#A8D5BA]/20"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ajouter au panier
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 bg-[#E88D67] hover:bg-[#d67a52] text-white"
            >
              Acheter maintenant
            </Button>
          </div>

          {/* Contact Producer */}
          <Button variant="ghost" className="w-full text-[#4A7C59]">
            <MessageCircle className="h-5 w-5 mr-2" />
            Contacter le producteur
          </Button>
        </div>
      </div>

      {/* Map Section */}
      <Card className="mt-8 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-64 bg-gray-100">
            {/* Placeholder for map */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#A8D5BA]/30 to-[#4A7C59]/10">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-[#4A7C59] mx-auto mb-2" />
                <p className="font-medium text-gray-700">{product.location.city}</p>
                <p className="text-sm text-gray-500">{product.location.postalCode}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Products */}
      {suggestedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onProductClick={() => {
                  useAppStore.getState().setSelectedProduct(p.id);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
