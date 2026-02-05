'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';
import { mockUsers } from '@/data/mockDatabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MapPin,
  Truck,
  Store,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const {
    cart,
    getCartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    user,
    isAuthenticated,
  } = useAppStore();
  const { toast } = useToast();
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const total = getCartTotal();
  const deliveryFee = deliveryMethod === 'delivery' ? 2.5 : 0;
  const finalTotal = total + deliveryFee;

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

  const handleCheckout = () => {
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

    // Simulate order processing
    setTimeout(() => {
      cart.forEach((item) => {
        createOrder({
          buyerId: user!.id,
          sellerId: item.product.sellerId,
          productId: item.productId,
          quantity: item.quantity,
          amount: item.product.price * item.quantity,
          status: 'pending',
          deliveryMethod,
        });
      });

      clearCart();
      setIsProcessing(false);
      setOrderSuccess(true);

      toast({
        title: 'Commande confirmée !',
        description: 'Vous recevrez une confirmation par email',
      });
    }, 2000);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#A8D5BA] flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-[#4A7C59]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Commande confirmée !
        </h1>
        <p className="text-gray-600 mb-8">
          Merci pour votre commande. Vous recevrez un email de confirmation avec les détails de retrait.
        </p>
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="font-semibold mb-4">Récapitulatif</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Votre commande a été transmise aux producteurs</p>
            <p>• Vous serez notifié quand elle sera prête</p>
            <p>• N'oubliez pas d'apporter vos sacs réutilisables !</p>
          </div>
        </div>
        <Button
          onClick={() => useAppStore.getState().setCurrentPage('home')}
          className="bg-[#4A7C59] hover:bg-[#3a6349] text-white px-8"
        >
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#A8D5BA]/30 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-[#4A7C59]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Votre panier est vide
        </h1>
        <p className="text-gray-600 mb-8">
          Explorez nos produits frais et ajoutez-les à votre panier
        </p>
        <Button
          onClick={() => useAppStore.getState().setCurrentPage('products')}
          className="bg-[#4A7C59] hover:bg-[#3a6349] text-white px-8"
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
            const seller = mockUsers.find((u) => u.id === sellerId);
            return (
              <Card key={sellerId} className="overflow-hidden">
                <CardHeader className="bg-[#F8F9FA] py-4">
                  <div className="flex items-center gap-3">
                    {seller?.profile?.avatar && (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#A8D5BA]">
                        <Image
                          src={seller.profile.avatar}
                          alt={seller.firstName}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">
                        {seller?.firstName} {seller?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {seller?.location?.city}
                      </p>
                    </div>
                  </div>
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
                          <p className="text-lg font-bold text-[#4A7C59]">
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

              {/* Delivery Method */}
              <div className="space-y-3">
                <p className="font-medium text-sm">Mode de retrait</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={deliveryMethod === 'pickup' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={
                      deliveryMethod === 'pickup'
                        ? 'bg-[#4A7C59] hover:bg-[#3a6349] text-white'
                        : ''
                    }
                  >
                    <Store className="h-4 w-4 mr-1" />
                    Retrait
                  </Button>
                  <Button
                    variant={deliveryMethod === 'delivery' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={
                      deliveryMethod === 'delivery'
                        ? 'bg-[#4A7C59] hover:bg-[#3a6349] text-white'
                        : ''
                    }
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Livraison
                  </Button>
                </div>
              </div>

              {/* Delivery Fee */}
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{deliveryFee.toFixed(2)}€</span>
                </div>
              )}

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#4A7C59]">{finalTotal.toFixed(2)}€</span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-[#E88D67] hover:bg-[#d67a52] text-white py-6 text-lg"
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
              <div className="bg-[#A8D5BA]/20 rounded-lg p-3 text-sm text-gray-600">
                <p className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                  Paiement sécurisé
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
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
