'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { checkoutService } from '@/services/checkout.service';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const clearCart = useAppStore((state) => state.clearCart);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const hasCalledAPI = useRef(false);

  useEffect(() => {
    const confirmOrder = async () => {
      if (!sessionId) {
        setStatus('error');
        setErrorMessage("Identifiant de session introuvable. Veuillez passer par votre panier.");
        return;
      }

      if (hasCalledAPI.current) return;
      hasCalledAPI.current = true;

      try {
        await checkoutService.confirmSession(sessionId);

        clearCart();
        setStatus('success');
      } catch (error: any) {
        console.error("Erreur de confirmation:", error);
        setStatus('error');
        setErrorMessage(
          error.message || "Une erreur est survenue lors de la validation de votre commande."
        );
      }
    };

    confirmOrder();
  }, [sessionId, clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] max-w-2xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-16 w-16 text-[#4A7C59] animate-spin mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Validation de votre paiement...
        </h1>
        <p className="text-gray-500 text-lg">
          Veuillez patienter et ne pas fermer cette page.
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-[60vh] max-w-2xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <XCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Erreur de validation
        </h1>
        <p className="text-red-600 mb-8 text-lg">
          {errorMessage}
        </p>
        <Button
          onClick={() => router.push('/cart')}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl"
        >
          Retourner au panier
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] max-w-2xl mx-auto px-4 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-full bg-[#A8D5BA]/30 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <CheckCircle className="h-12 w-12 text-[#4A7C59]" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-in fade-in duration-700">
        Paiement réussi !
      </h1>
      <p className="text-gray-600 mb-10 text-lg">
        Merci pour votre commande. Les producteurs ont été notifiés et préparent vos produits. Vous allez recevoir un e-mail de confirmation d&apos;ici quelques minutes.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button
          onClick={() => router.push('/settings/profile')}
          variant="outline"
          className="border-[#4A7C59] text-[#4A7C59] hover:bg-[#A8D5BA]/10 px-8 py-6 text-lg rounded-xl w-full sm:w-auto"
        >
          Voir mes commandes
        </Button>
        <Button
          onClick={() => router.push('/')}
          className="bg-[#4A7C59] hover:bg-[#3a6349] text-white px-8 py-6 text-lg rounded-xl w-full sm:w-auto shadow-md"
        >
          Retour à l&apos;accueil
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="h-10 w-10 text-[#4A7C59] animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}