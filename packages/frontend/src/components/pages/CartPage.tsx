'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Store,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkoutService } from '@/services/checkout.service';
import SellerIdentity from '@/components/shared/seller-identity';

export default function CartPage() {
  const {
    cart,
    getCartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    isAuthenticated,
  } = useAppStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getCartTotal();
  const finalTotal = total;

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateCartQuantity(productId, quantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: 'Produit retiré',
      description: 'Le produit a été retiré de votre panier',
    });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour passer commande',
        variant: 'destructive',
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: 'Panier vide',
        description: 'Ajoutez des produits avant de commander',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const data = await checkoutService.createCheckoutSession();

      if (data?.url) {
        globalThis.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue.');
      }
    } catch (error: any) {
      console.error('Erreur Checkout:', error);
      toast({
        title: 'Erreur de paiement',
        description: error.message || 'Impossible d\'initier le paiement.',
        variant: 'destructive',
      });
      setIsProcessing(false);
      return;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-light-green/30 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-olive" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Votre panier est vide
        </h1>
        <p className="text-gray-600 mb-8">
          Explorez nos produits frais et ajoutez-les à votre panier
        </p>
        <Button
          onClick={() => useAppStore.getState().setCurrentPage('products')}
          className="bg-olive hover:bg-olive-dark text-white px-8"
        >
          Voir les produits
        </Button>
      </div>
    );
  }

  // Group cart items by seller
  const itemsBySeller = cart.reduce((acc, item) => {
    const sellerId = item.product.sellerId;
    if (!acc[sellerId]) {
      acc[sellerId] = [];
    }
    acc[sellerId].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(itemsBySeller).map(([sellerId, items]) => {
            return (
              <Card key={sellerId} className="overflow-hidden">
                <CardHeader className="bg-off-white py-4">
                  <SellerIdentity
                    seller={items[0]?.product?.seller ?? null}
                    fallbackCity={items[0]?.product?.location?.city || 'France'}
                  />
                </CardHeader>
                <CardContent className="p-0">
                  {items.map((item, index) => (
                    <div key={item.productId}>
                      {index > 0 && <Separator />}
                      <div className="p-4 flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {item.product.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.product.price.toFixed(2)}€ / {item.product.unit}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border rounded-full">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() =>
                                  handleQuantityChange(item.productId, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() =>
                                  handleQuantityChange(item.productId, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.product.quantity}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(item.productId)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-olive">
                            {(item.product.price * item.quantity).toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Vider le panier
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{total.toFixed(2)}€</span>
              </div>

              <div className="rounded-lg bg-light-green/20 p-3 text-sm text-gray-700">
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <Store className="h-4 w-4 text-olive" />
                  Retrait sur place uniquement
                </p>
                <p className="mt-1">Le paiement confirme votre commande. Vous récupérez ensuite vos produits chez le producteur.</p>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-olive">{finalTotal.toFixed(2)}€</span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-earth-orange hover:bg-earth-orange-dark text-white py-6 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Passer la commande
                  </>
                )}
              </Button>

              {/* Login Prompt */}
              {!isAuthenticated && (
                <p className="text-sm text-center text-gray-500">
                  Connectez-vous pour passer commande
                </p>
              )}

              {/* Info */}
              <div className="bg-light-green/20 rounded-lg p-3 text-sm text-gray-600">
                <p className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-olive" />
                  Paiement sécurisé
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-olive" />
                  Satisfait ou remboursé
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
