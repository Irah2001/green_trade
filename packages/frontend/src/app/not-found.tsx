'use client';

import Link from 'next/link';
import { House, Leaf, ShoppingBag } from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

const NotFound = () => {
  const filterByCategory = useAppStore((state) => state.filterByCategory);
  const searchProducts = useAppStore((state) => state.searchProducts);
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const setSelectedProduct = useAppStore((state) => state.setSelectedProduct);

  const returnToMarket = () => {
    setSelectedProduct(null);
    setCurrentPage('home');
  };

  const discoverSeasonalProducts = () => {
    setSelectedProduct(null);
    filterByCategory(null);
    searchProducts('');
    setCurrentPage('products');
  };

  return (
    <div className="flex min-h-screen flex-col bg-off-white text-[#1a1a1a] font-heading">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-24 top-10 h-80 w-80 rounded-full bg-light-green/30 blur-3xl" />
            <div className="absolute right-24 top-20 h-96 w-96 rounded-full bg-white/90 blur-3xl" />
            <div className="absolute bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-earth-orange/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,249,250,0.7)_0%,rgba(248,249,250,0.92)_36%,rgba(248,249,250,1)_100%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="w-full">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <div className="relative mb-8 mt-4 flex w-57.5 items-center justify-center md:mb-10 md:mt-6 md:w-90">
                  <div className="absolute inset-x-[-20%] top-14 h-24 rounded-full bg-light-green/25 blur-3xl md:top-20 md:h-32" />
                  <div className="relative flex h-57.5 w-57.5 items-center justify-center rounded-full bg-white/90 shadow-[0_35px_90px_-28px_rgba(74,124,89,0.35)] ring-1 ring-white/80 md:h-90 md:w-90">
                    <Leaf className="h-24 w-24 text-olive stroke-[2.2] md:h-36 md:w-36" aria-hidden="true" />
                  </div>
                  <div className="absolute -bottom-1 right-2 rotate-6 rounded-2xl bg-white px-4 py-3 shadow-[0_14px_28px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5 md:right-10">
                    <span className="font-heading text-lg font-semibold text-olive">404</span>
                  </div>
                </div>

                <h1 className="font-heading text-[clamp(2rem,4.2vw,4rem)] font-bold leading-[0.98] tracking-tight text-[#15181d] md:max-w-4xl">
                  <span className="block">Oups ! Cette page est</span>
                  <span className="block">partie en balade…</span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#4b5563] md:text-base">
                  Il semblerait que le chemin que vous avez emprunté ne mène nulle part.
                  Pas d&apos;inquiétude, nos producteurs locaux sont toujours là !
                </p>

                <div className="mx-auto mt-10 grid w-full max-w-3xl gap-3 md:grid-cols-2">
                  <Button asChild className="h-auto min-h-16 w-full whitespace-normal rounded-2xl bg-earth-orange px-6 py-4 text-base font-semibold text-white shadow-[0_18px_40px_-20px_rgba(232,141,103,0.95)] hover:bg-earth-orange-dark">
                    <Link href="/" replace onClick={returnToMarket}>
                      <House className="h-5 w-5" aria-hidden="true" />
                      <span>Retourner au marché</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-auto min-h-16 w-full whitespace-normal rounded-2xl border-[#d9e6dc] bg-[#edf3ee] px-6 py-4 text-base font-semibold text-[#3f6b50] shadow-[0_18px_40px_-24px_rgba(74,124,89,0.2)] hover:bg-[#e4ede6] hover:text-[#345943]"
                  >
                    <Link href="/" replace onClick={discoverSeasonalProducts}>
                      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                      <span>Découvrir les produits de saison</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;
