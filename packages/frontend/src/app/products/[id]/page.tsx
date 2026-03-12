"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { MapPin, Heart, Share2, ShieldCheck, ChevronLeft, Minus, Plus, MessageCircle } from "lucide-react";
import { productService } from "@/services/product.service";
import { useAppStore } from "@/store/useAppStore";
import ProductCard from "@/components/ProductCard";

const FALLBACK_IMAGE = '/images/green_trade.webp';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, filteredProducts, loadProducts } = useAppStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    if (filteredProducts.length === 0) loadProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-off-white min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl h-[500px] animate-pulse border border-gray-100" />
        </div>
      </div>
    );
  }

  if (!product) return notFound();

  const image = product.images?.[0] || FALLBACK_IMAGE;
  const city = product.location?.city || '';
  const isSurplus = product.tags?.includes('surplus');
  const isBio = product.tags?.includes('bio');
  const suggestedProducts = filteredProducts.filter(p => p.id !== id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      sellerId: product.sellerId,
      title: product.title,
      description: product.description,
      price: product.price,
      unit: product.unit ?? 'unité',
      category: product.category,
      organic: product.organic ?? false,
      images: product.images?.length ? product.images : [FALLBACK_IMAGE],
      location: { city, postalCode: product.location?.postalCode ?? '', coordinates: product.location?.coordinates ?? [0, 0] },
      status: product.status,
      quantity: product.quantity ?? 0,
      tags: product.tags ?? [],
      views: product.views ?? 0,
      createdAt: product.createdAt ?? new Date().toISOString(),
      updatedAt: product.updatedAt ?? new Date().toISOString(),
      isSurplusOfDay: isSurplus,
    }, quantity);
  };

  return (
    <div className="bg-off-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
          <Link href="/products" className="flex items-center gap-1 hover:text-olive transition-colors font-medium">
            <ChevronLeft className="w-4 h-4" /> Retour aux produits
          </Link>
          <div className="flex gap-4">
            <button className="flex items-center gap-1 hover:text-accent transition-colors"><Heart className="w-4 h-4" /> Sauvegarder</button>
            <button className="flex items-center gap-1 hover:text-gray-900 transition-colors"><Share2 className="w-4 h-4" /> Partager</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="relative h-[400px] md:h-full min-h-[500px] bg-gray-50">
              {isSurplus && (
                <div className="absolute top-6 left-6 z-10 bg-accent/90 backdrop-blur text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                  Surplus du jour
                </div>
              )}
              <Image
                src={image}
                alt={product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Product Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-light-green/20 text-olive px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                    {product.category === 'fruits' ? 'Fruits' : product.category === 'vegetables' ? 'Légumes' : 'Paniers'}
                  </span>
                  {isBio && (
                    <span className="bg-olive/10 text-olive px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Bio
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                  {product.title}
                </h1>

                <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
                  <span className="text-4xl font-black text-olive">{Number(product.price).toFixed(2)}€</span>
                  <span className="text-lg text-gray-500 font-medium mb-1">/ {product.unit ?? 'unité'}</span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">Description du jardinier</h3>
                <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                {/* Seller Info */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-8 flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-light-green rounded-full flex items-center justify-center text-olive font-bold text-xl border-2 border-white shadow-sm">
                      {product.sellerId?.charAt(0)?.toUpperCase() ?? 'V'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">Vendeur</p>
                      {city && (
                        <div className="flex items-center text-sm text-gray-500 mt-0.5 gap-1">
                          <MapPin className="w-3.5 h-3.5 text-accent" /> {city}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="p-2.5 bg-white rounded-full text-olive shadow-sm hover:bg-olive hover:text-white transition-colors border border-gray-200">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Area */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    État : <span className="text-gray-900 font-bold">{product.condition}</span>
                  </span>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-accent transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold w-6 text-center text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-olive transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-accent hover:bg-[#D67C56] text-white text-lg font-bold py-5 rounded-2xl transition-all shadow-[0_8px_30px_rgba(232,141,103,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(232,141,103,0.4)] flex items-center justify-center gap-3"
                >
                  Payer et Réserver le produit
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 flex justify-center items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Paiement 100% sécurisé via Stripe
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Section */}
        {suggestedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
              Vous aimerez aussi ces produits bio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
