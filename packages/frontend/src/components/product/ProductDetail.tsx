'use client';

import { useState } from 'react';
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
  Store,
  ArrowLeft,
} from 'lucide-react';

// UI components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { Product } from '@/types/models';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/product/ProductCard';
import SellerIdentity from '@/components/shared/seller-identity';
import ProductGallery from './ProductGallery';
import { conversationService } from '@/services/conversation.service';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: Readonly<ProductDetailProps>) {
  const { addToCart, products: storeProducts, isAuthenticated, user } = useAppStore();
  const { toast } = useToast();

  const handleContactProducer = async () => {
    if (!isAuthenticated || !user) {
      toast({ title: 'Connexion requise', description: 'Connectez-vous pour contacter le producteur.' });
      return;
    }
    if (user.id === product.sellerId) {
      toast({ title: 'Action impossible', description: 'Vous ne pouvez pas vous contacter vous-même.' });
      return;
    }
    try {
      const conv = await conversationService.createOrFind(product.sellerId);
      useAppStore.getState().setActiveConversationId(conv.id);
      useAppStore.getState().setCurrentPage('messages');
    } catch {
      toast({ title: 'Erreur', description: "Impossible d'ouvrir la conversation." });
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  // Get suggested products from the real store
  const suggestedProducts = storeProducts
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
        <div className="relative space-y-4">
          <ProductGallery images={product.images} />

          <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
            {product.isSurplusOfDay && (
              <Badge className="bg-earth-orange text-white text-sm px-3 py-1 shadow-md">
                🔥 Surplus du jour
              </Badge>
            )}
            {product.organic && (
              <Badge className="bg-olive text-white text-sm px-3 py-1 shadow-md">
                <Check className="h-4 w-4 mr-1" />
                Bio
              </Badge>
            )}
          </div>

          <div className="absolute top-4 right-4 flex gap-2 z-10">
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

        {/* Product Info */}
        <div className="space-y-6">
          {/* Seller */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SellerIdentity seller={product.seller ?? null} fallbackCity={product.location.city} />
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>Profil vérifié</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5 text-olive" />
            <span>{product.location.city}, {product.location.postalCode}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-olive">
              {product.price.toFixed(2)}€
            </span>
            <span className="text-gray-500 text-lg">/{product.unit}</span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-light-green/20 text-olive">
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

          <div className="rounded-lg bg-light-green/20 p-4 text-sm text-gray-700">
            <p className="font-medium text-gray-900 flex items-center gap-2">
              <Store className="h-5 w-5 text-olive" />
              Retrait sur place uniquement
            </p>
            <p className="mt-1">La commande est préparée par le producteur, puis retirée en magasin ou à la ferme.</p>
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
                Total: <span className="font-bold text-olive">{totalPrice.toFixed(2)}€</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="flex-1 border-olive text-olive hover:bg-light-green/20"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ajouter au panier
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 bg-earth-orange hover:bg-earth-orange-dark text-white"
            >
              Acheter maintenant
            </Button>
          </div>

          {/* Contact Producer */}
          <Button variant="ghost" className="w-full text-olive" onClick={handleContactProducer}>
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
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-light-green/30 to-olive/10">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-olive mx-auto mb-2" />
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
                onProductClick={(_p: Product) => {
                  useAppStore.getState().setSelectedProduct(p.id);
                  useAppStore.getState().setCurrentPage('product-detail');
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
