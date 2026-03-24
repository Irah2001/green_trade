"use client";

import { useState } from "react";
import { UploadCloud, MapPin, CheckCircle, Info, ArrowRight } from "lucide-react";
import Link from "next/link";

import { useAppStore } from "@/store/useAppStore";

export default function PublishPage() {
  const { createProduct, isAuthenticated } = useAppStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<'neuf' | 'excellent' | 'bon' | 'acceptable'>('bon');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle(''); setCategory(''); setDescription(''); setPrice('');
    setCondition('bon'); setCity(''); setPostalCode(''); setIsFree(false);
    setCreatedId(null); setError('');
  };

  const handleSubmit = async () => {
    setError('');

    if (!isAuthenticated) {
      setError('Vous devez être connecté pour publier une annonce.');
      return;
    }

    setLoading(true);
    const { success, id, message } = await createProduct({
      title,
      category,
      description,
      price: isFree ? 0 : Number(price),
      condition,
      location: city
        ? { type: 'Point', coordinates: [0, 0], city, postalCode }
        : undefined,
    });
    setLoading(false);

    if (success && id) {
      setCreatedId(id);
    } else {
      setError(message || 'Une erreur est survenue.');
    }
  };

  // Écran de succès
  if (createdId !== null) {
    return (
      <div className="bg-off-white min-h-screen py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-light-green/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-olive" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Annonce publiée !</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Votre annonce est en ligne et visible par tous les acheteurs de la plateforme.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/products/${createdId}`}
                className="w-full bg-olive hover:bg-olive/90 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Voir mon annonce <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-2xl transition-all text-center"
              >
                Voir tous les produits
              </Link>
              <button
                onClick={resetForm}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2"
              >
                Publier une autre annonce
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-off-white min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Vendre ou donner son surplus</h1>
          <p className="text-gray-500 text-lg">Publiez votre annonce en 2 minutes chrono. C&apos;est simple, rapide et bon pour la planète !</p>
        </div>

        <form className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

          {/* Section 1: Photos */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">1. Photos du produit</h2>
            <div className="border-2 border-dashed border-olive/30 rounded-2xl bg-light-green/5 p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-light-green/10 transition-colors group">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                <UploadCloud className="w-8 h-8 text-olive" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">Cliquez ou glissez vos photos ici</p>
              <p className="text-sm text-gray-500">Max 5 photos. Formats JPG, PNG.</p>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">2. Informations générales</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">Titre de l&apos;annonce <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="ex: Pommes non traitées du verger"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">Catégorie <span className="text-red-500">*</span></label>
                  <select
                    id="category"
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all font-medium appearance-none"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Légumes</option>
                    <option value="baskets">Paniers / Lots</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-semibold text-gray-900 mb-2">État <span className="text-red-500">*</span></label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={e => setCondition(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all font-medium appearance-none"
                  >
                    <option value="neuf">Neuf</option>
                    <option value="excellent">Excellent</option>
                    <option value="bon">Bon</option>
                    <option value="acceptable">Acceptable</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">Description <span className="text-red-500">*</span></label>
                <textarea
                  id="description"
                  rows={4}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Décrivez brièvement le produit, la méthode de culture (bio, sans traitement...)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Prix */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">3. Prix ou don</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className={`bg-gray-50 p-6 rounded-2xl border shadow-sm relative overflow-hidden ${isFree ? 'border-gray-200' : 'border-olive/30'}`}>
                {isFree ? null : <div className="absolute top-0 right-0 w-2 h-full bg-olive" />}
                <div className="flex gap-3 mb-4">
                  <input type="radio" name="price_type" id="price_sell" className="w-5 h-5 text-olive focus:ring-olive mt-0.5" checked={!isFree} onChange={() => setIsFree(false)} />
                  <div>
                    <label htmlFor="price_sell" className="font-bold text-lg text-gray-900 cursor-pointer block mb-1">Je vends</label>
                    <p className="text-sm text-gray-500 mb-3">Fixez un prix petit ou symbolique</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="0.00"
                        disabled={isFree}
                        className="w-24 bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-olive font-bold text-lg disabled:opacity-50"
                      />
                      <span className="font-bold text-gray-500">€ / unité</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`bg-gray-50 p-6 rounded-2xl border border-dashed cursor-pointer transition-colors relative overflow-hidden group text-left w-full ${isFree ? 'border-accent/60' : 'border-gray-200 hover:border-accent/40'}`}
                onClick={() => setIsFree(true)}
                aria-label="Sélectionner l'option donner gratuitement"
              >
                <div className="flex gap-3 items-start">
                  <input type="radio" name="price_type" id="price_give" className="w-5 h-5 text-accent focus:ring-accent mt-0.5" checked={isFree} onChange={() => setIsFree(true)} />
                  <div>
                    <label htmlFor="price_give" className="font-bold text-lg text-gray-900 cursor-pointer block mb-1">Je donne</label>
                    <p className="text-sm text-gray-500">Idéal pour le surplus non vendable et lutter contre le gaspillage total.</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 4: Lieu */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">4. Point de retrait</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label htmlFor="city" className="sr-only">Ville</label>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Ville"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="sr-only">Code postal</label>
                <input
                  type="text"
                  id="postalCode"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  placeholder="Code postal"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
          </div>

          {/* Tips / Info */}
          <div className="bg-light-green/20 p-4 rounded-xl flex items-start gap-3 mb-8">
            <Info className="w-5 h-5 text-olive shrink-0 mt-0.5" />
            <p className="text-sm text-olive font-medium leading-relaxed">
              Une fois un acheteur intéressé, il paiera via la plateforme de manière sécurisée. Vous serez alors mis en relation pour organiser le retrait !
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-[#D67C56] text-white text-lg font-bold py-5 rounded-2xl transition-all shadow-[0_4px_20px_0_rgba(232,141,103,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(232,141,103,0.4)] flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <CheckCircle className="w-6 h-6" />
            {loading ? 'Publication en cours...' : 'Publier mon annonce'}
          </button>
        </form>

      </div>
    </div>
  );
}
