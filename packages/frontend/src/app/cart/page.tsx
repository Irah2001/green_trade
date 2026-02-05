import Image from "next/image";
import Link from "next/link";
import { Trash2, ShieldCheck, CreditCard, Apple, ArrowRight } from "lucide-react";
import { mockProducts as MOCK_PRODUCTS } from "@/data/mockDatabase";

export default function CartPage() {
  // Mock cart items based on the data
  const cartItems = [
    { product: MOCK_PRODUCTS[0], quantity: 2 },
    { product: MOCK_PRODUCTS[3], quantity: 1 }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const fee = 0.50; // Frais de service Green Trade
  const total = subtotal + fee;

  return (
    <div className="bg-off-white min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight flex items-center gap-3">
          Votre Panier <span className="bg-olive/10 text-olive text-sm font-bold px-3 py-1 rounded-full">{cartItems.length}</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={item.product.id} className={`flex flex-col sm:flex-row gap-4 sm:gap-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
                    {/* Item Image */}
                    <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.title} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.product.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.product.price.toFixed(2)}€ / {item.product.unit}</p>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-full">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                          <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-accent font-bold">-</button>
                          <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                          <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-olive font-bold">+</button>
                        </div>
                        <span className="font-bold text-olive text-lg">{(item.product.price * item.quantity).toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-light-green/20 rounded-2xl p-6 border border-olive/20 flex gap-4 items-start">
              <Apple className="w-6 h-6 text-olive shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-olive mb-1">C'est bon pour la planète !</h4>
                <p className="text-sm text-gray-600 leading-relaxed">En commandant ces produits en circuit ultra-court, vous sauvez {subtotal.toFixed(0)}kg de nourriture et soutenez les agriculteurs de votre région.</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Récapitulatif</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total ({cartItems.length} articles)</span>
                  <span className="font-medium text-gray-900">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1.5">Frais de service <div className="w-4 h-4 rounded-full bg-gray-200 text-white flex justify-center items-center text-[10px] cursor-help">?</div></span>
                  <span className="font-medium text-gray-900">{fee.toFixed(2)}€</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg mt-2">
                  <span className="font-bold text-gray-900 tracking-tight">Total TTC</span>
                  <span className="font-black text-olive text-2xl">{total.toFixed(2)}€</span>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="delivery" className="w-4 h-4 text-olive focus:ring-olive border-gray-300 pointer-events-none" defaultChecked />
                  <span className="text-sm font-semibold text-gray-900">Retrait chez le producteur <span className="text-gray-500 font-normal">({MOCK_PRODUCTS[0].location.distance || 2.5}km)</span></span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer opacity-50">
                  <input type="radio" name="delivery" className="w-4 h-4 text-olive focus:ring-olive border-gray-300 pointer-events-none" disabled />
                  <span className="text-sm font-semibold text-gray-900 line-through">Livraison vélo <span className="text-gray-500 font-normal">(Indisponible)</span></span>
                </label>
              </div>
              
              <button className="w-full bg-accent hover:bg-[#D67C56] text-white text-lg font-bold py-4 rounded-2xl transition-all shadow-[0_4px_20px_0_rgba(232,141,103,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(232,141,103,0.4)] flex items-center justify-center gap-2 group mb-4">
                <CreditCard className="w-5 h-5 flex-shrink-0" />
                <span>Régler la commande</span>
                <ArrowRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 py-2 rounded-xl border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-olive" /> Paiements SSL 256 bits
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
