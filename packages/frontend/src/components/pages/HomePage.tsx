'use client';

import { useState } from 'react';
import Image from 'next/image';
import { mockProducts, mockUsers, Product } from '@/data/mockDatabase';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/ProductCard';
import { Search, Leaf, Users, MapPin, ArrowRight, Package } from 'lucide-react';

export default function HomePage() {
  const { setCurrentPage, setSelectedProduct, searchProducts, products } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const activeProducts = products.filter((p) => p.status === 'active');

  // Products tagged "surplus"
  const surplusProducts = activeProducts.filter((p) => p.tags.includes('surplus')).slice(0, 4);

  // Latest products
  const latestProducts = [...activeProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const handleSearch = () => {
    if (searchQuery.trim() || searchCity.trim()) {
      searchProducts(searchQuery || searchCity);
      setCurrentPage('products');
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product.id);
    setCurrentPage('product-detail');
  };



  return (
    <div className="min-h-screen">
      {/* Hero Section — Split Layout */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F8F9FA] via-white to-[#f0f7f2]">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#A8D5BA]/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#A8D5BA]/8 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* ======= LEFT COLUMN ======= */}
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#A8D5BA]/20 border border-[#A8D5BA]/40 rounded-full px-4 py-1.5 mb-6">
                <Leaf className="h-4 w-4 text-[#4A7C59]" />
                <span className="text-sm font-medium text-[#4A7C59]">Marketplace Locale de Produits Frais</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] text-gray-900 mb-6">
                Vendez vos surplus,<br />
                <span className="text-[#4A7C59]">achetez local !</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
                Rejoignez vos voisins pour réduire le gaspillage alimentaire. 
                Achetez et vendez des fruits et légumes frais, cultivés localement, 
                directement depuis les jardins près de chez vous.
              </p>

              {/* Search Bar */}
              <form action={handleSearch} className="mb-8">
                <div className="flex items-center bg-white rounded-full shadow-lg shadow-gray-200/60 border border-gray-100 p-1.5 max-w-lg">
                  <div className="flex items-center flex-1 min-w-0">
                    <Search className="h-4 w-4 text-gray-400 ml-3 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Que cherchez-vous ?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full py-2"
                    />
                  </div>
                  <div className="hidden sm:flex items-center border-l border-gray-200 flex-1 min-w-0">
                    <MapPin className="h-4 w-4 text-gray-400 ml-3 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Votre ville"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full py-2"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-[#E88D67] hover:bg-[#d67a52] text-white rounded-full px-5 py-2.5 text-sm font-medium shrink-0 ml-1"
                  >
                    Rechercher
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </form>

              {/* Stats Row */}
              <div className="flex items-center gap-8 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A8D5BA]/25 flex items-center justify-center">
                    <Package className="h-5 w-5 text-[#4A7C59]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">2 500+</p>
                    <p className="text-xs text-gray-500">Produits</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A8D5BA]/25 flex items-center justify-center">
                    <Users className="h-5 w-5 text-[#4A7C59]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">150+</p>
                    <p className="text-xs text-gray-500">Producteurs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A8D5BA]/25 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-[#4A7C59]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">50+</p>
                    <p className="text-xs text-gray-500">Villes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ======= RIGHT COLUMN — Images ======= */}
            <div className="relative hidden lg:block h-[520px]">
              {/* Floating notification — top */}
              <div className="hero-notification hero-card-float absolute -top-2 left-[15%] z-30 flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-[#A8D5BA]/30 flex items-center justify-center text-lg">
                  🥬
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Nouvelle annonce</p>
                  <p className="text-sm font-semibold text-gray-800">Salade fraîche</p>
                </div>
              </div>

              {/* Image 1 — vegetables (center, slight left tilt) */}
              <div className="absolute top-12 left-0 w-[260px] h-[320px] z-10" style={{ transform: 'rotate(-6deg)' }}>
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=520&h=640&fit=crop&crop=center"
                  alt="Légumes frais du marché"
                  fill
                  className="hero-image object-cover"
                  sizes="260px"
                  priority
                />
              </div>

              {/* Image 2 — fruits (center-right, slight right tilt) */}
              <div className="absolute top-6 left-[200px] w-[240px] h-[300px] z-20" style={{ transform: 'rotate(4deg)' }}>
                <Image
                  src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=480&h=600&fit=crop&crop=center"
                  alt="Fruits frais du marché"
                  fill
                  className="hero-image object-cover"
                  sizes="240px"
                  priority
                />

              </div>

              {/* Image 3 — apples (far right, more tilt) */}
              <div className="absolute top-16 right-0 w-[220px] h-[280px] z-10" style={{ transform: 'rotate(8deg)' }}>
                <Image
                  src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=440&h=560&fit=crop&crop=center"
                  alt="Pommes du verger"
                  fill
                  className="hero-image object-cover"
                  sizes="220px"
                  priority
                />
              </div>

              {/* Floating notification — bottom right */}
              <div className="hero-notification hero-card-float-delayed absolute bottom-8 right-4 z-30 flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-lg">
                  🍎
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Vendu !</p>
                  <p className="text-sm font-semibold text-gray-800">5 kg Pommes</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom soft divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A8D5BA]/30 to-transparent" />
      </section>

      {/* Surplus of the Day */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-[#E88D67] text-white badge-pulse">
                  🔥 Surplus du jour
                </Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Ne ratez pas ces offres !
              </h2>
              <p className="text-gray-600 mt-1">
                Produits frais à prix réduits, disponibles aujourd&apos;hui uniquement
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage('products')}
              className="hidden md:flex items-center gap-2 border-[#4A7C59] text-[#4A7C59]"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {surplusProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage('products')}
            className="w-full mt-6 md:hidden border-[#4A7C59] text-[#4A7C59]"
          >
            Voir tous les produits
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-[#A8D5BA]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En quelques clics, accédez aux produits frais de vos producteurs locaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#4A7C59] flex items-center justify-center mx-auto mb-4 text-3xl">
                🔍
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Cherchez</h3>
              <p className="text-gray-600">
                Trouvez des produits frais près de chez vous parmi les annonces des producteurs locaux
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#4A7C59] flex items-center justify-center mx-auto mb-4 text-3xl">
                🛒
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Commandez</h3>
              <p className="text-gray-600">
                Ajoutez les produits à votre panier et passez commande en quelques clics
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#4A7C59] flex items-center justify-center mx-auto mb-4 text-3xl">
                🥬
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Dégustez</h3>
              <p className="text-gray-600">
                Récupérez vos produits chez le producteur ou faites-vous livrer à domicile
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Dernières annonces
              </h2>
              <p className="text-gray-600 mt-1">
                Les produits fraîchement ajoutés par nos producteurs
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage('products')}
              className="hidden md:flex items-center gap-2 border-[#4A7C59] text-[#4A7C59]"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Become Producer CTA */}
      <section className="py-16 bg-[#4A7C59]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Vous êtes producteur ?
              </h2>
              <p className="text-white/90 text-lg max-w-xl">
                Vendez vos surplus et atteignez des milliers de clients locaux. 
                Inscrivez-vous gratuitement et commencez à vendre dès aujourd&apos;hui !
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setCurrentPage('publish')}
              className="bg-[#E88D67] hover:bg-[#d67a52] text-white px-8 py-6 text-lg rounded-full shrink-0"
            >
              Publier une annonce
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Producers */}
      <section className="py-12 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Nos producteurs vedettes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockUsers
              .filter((u) => u.role === 'producer')
              .slice(0, 3)
              .map((producer) => (
                <div
                  key={producer.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {producer.profile?.avatar && (
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-[#A8D5BA]">
                        <Image
                          src={producer.profile.avatar}
                          alt={`${producer.firstName} ${producer.lastName}`}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {producer.firstName} {producer.lastName}
                      </h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {producer.location?.city}
                      </p>
                    </div>
                  </div>
                  {producer.profile?.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {producer.profile.bio}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{producer.rating?.toFixed(1)}</span>
                    </div>
                    <Badge className="bg-[#A8D5BA]/30 text-[#4A7C59]">
                      {mockProducts.filter((p) => p.sellerId === producer.id).length} produits
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
