'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

function SuccessContent() {
  const router = useRouter();
  const clearCart = useAppStore((state) => state.clearCart);

  const [status, setStatus] = useState<'loading' | 'success'>('loading');

  useEffect(() => {
    clearCart();
    const timer = setTimeout(() => {
      setStatus('success');
    }, 800);

    return () => clearTimeout(timer);
  }, [clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] max-w-2xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-16 w-16 text-olive animate-spin mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Validation de votre paiement...
        </h1>
        <p className="text-gray-500 text-lg">
          Veuillez patienter et ne pas fermer cette page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] max-w-2xl mx-auto px-4 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-full bg-light-green/30 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <CheckCircle className="h-12 w-12 text-olive" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-in fade-in duration-700">
        Paiement réussi !
      </h1>
      <p className="text-gray-600 mb-10 text-lg">
        Merci pour votre commande. Les producteurs ont été notifiés et préparent vos produits. Vous allez recevoir un e-mail de confirmation d&apos;ici quelques minutes.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button
          onClick={() => router.push('/settings/orders')}
          variant="outline"
          className="border-olive text-olive hover:bg-light-green/10 px-8 py-6 text-lg rounded-xl w-full sm:w-auto"
        >
          Voir mes commandes
        </Button>
        <Button
          onClick={() => router.push('/')}
          className="bg-olive hover:bg-olive-dark text-white px-8 py-6 text-lg rounded-xl w-full sm:w-auto shadow-md"
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
        <Loader2 className="h-10 w-10 text-olive animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
