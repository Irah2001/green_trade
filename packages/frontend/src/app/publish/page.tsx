"use client";

import { UploadCloud, MapPin, CheckCircle, Info } from "lucide-react";

export default function PublishPage() {
  return (
    <div className="bg-off-white min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Vendre ou donner son surplus</h1>
          <p className="text-gray-500 text-lg">Publiez votre annonce en 2 minutes chrono. C'est simple, rapide et bon pour la planète !</p>
        </div>

        <form className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100" action={() => {}}>
          
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Titre de l'annonce <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="ex: Pommes non traitées du verger" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Catégorie <span className="text-red-500">*</span></label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all font-medium appearance-none">
                    <option value="">Sélectionner...</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Légumes</option>
                    <option value="baskets">Paniers / Lots</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Quantité disponible <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="ex: 5" 
                      className="w-2/3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all font-medium"
                    />
                    <select className="w-1/3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all font-medium appearance-none">
                      <option value="kg">kg</option>
                      <option value="pc">Pièce(s)</option>
                      <option value="botte">Botte(s)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description <span className="text-red-500">*</span></label>
                <textarea 
                  rows={4}
                  placeholder="Décrivez brièvement le produit, la méthode de culture (bio, sans traitement...)" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Prix & Echange */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">3. Prix ou don</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="bg-gray-50 p-6 rounded-2xl border border-olive/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-olive"></div>
                <div className="flex gap-3 mb-4">
                  <input type="radio" name="price_type" id="price_sell" className="w-5 h-5 text-olive focus:ring-olive mt-0.5" defaultChecked />
                  <div>
                    <label htmlFor="price_sell" className="font-bold text-lg text-gray-900 cursor-pointer block mb-1">Je vends</label>
                    <p className="text-sm text-gray-500 mb-3">Fixez un prix petit ou symbolique</p>
                    <div className="flex items-center gap-2">
                     <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-24 bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-olive font-bold text-lg"
                      />
                      <span className="font-bold text-gray-500">€ / unité</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 border-dashed hover:border-accent/40 cursor-pointer transition-colors relative overflow-hidden group">
                <div className="flex gap-3 items-start opacity-70 group-hover:opacity-100 transition-opacity">
                  <input type="radio" name="price_type" id="price_give" className="w-5 h-5 text-accent focus:ring-accent mt-0.5" />
                  <div>
                    <label htmlFor="price_give" className="font-bold text-lg text-gray-900 cursor-pointer block mb-1">Je donne</label>
                    <p className="text-sm text-gray-500">Idéal pour le surplus non vendable et lutter contre le gaspillage total.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Lieu */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">4. Point de retrait</h2>
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <input 
                type="text" 
                defaultValue="44000 Nantes, France" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive focus:bg-white transition-all shadow-sm"
              />
            </div>
            
            <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Nantes,France&zoom=13&size=800x400&maptype=roadmap&markers=color:orange%7Clabel:P%7C47.2184,-1.5536&key=non_existent')] bg-cover bg-center bg-gray-300 opacity-60 mix-blend-multiply"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-white/90 backdrop-blur-md text-olive font-bold px-4 py-2 rounded-xl text-sm shadow-sm border border-white">
                   Aperçu Carte (Mock)
                 </div>
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

          <button className="w-full bg-accent hover:bg-[#D67C56] text-white text-lg font-bold py-5 rounded-2xl transition-all shadow-[0_4px_20px_0_rgba(232,141,103,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(232,141,103,0.4)] flex items-center justify-center gap-2 group">
            <CheckCircle className="w-6 h-6" />
            Publier mon annonce
          </button>
        </form>

      </div>
    </div>
  );
}
