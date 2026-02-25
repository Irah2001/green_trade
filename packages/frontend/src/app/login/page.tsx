'use client';

import Image from 'next/image';
import { Leaf, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Store
import { useAppStore } from '@/store/useAppStore';
// Hooks
import { useToast } from '@/hooks/use-toast';
// Types
import { LoginFormData } from '@/types/client.type';
// Images
import greenTradeImg from '../../../public/images/green_trade.webp';


export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const { toast } = useToast();

  const [form, setForm] = useState<LoginFormData>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(form.email, form.password);
    if (success) {
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue sur Green Trade !',
      });
      useAppStore.getState().setCurrentPage('home');
      router.push('/');
    } else {
      toast({
        title: 'Erreur de connexion',
        description: 'Email non trouvé. Essayez: john.doe@email.com ou admin@greentrade.fr',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black text-white p-8 flex-col justify-between overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={greenTradeImg}
            placeholder="blur"
            alt="Producteur de tomates local"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Leaf className="h-8 w-8 text-[#A8D5BA]" />
            <span className="text-xl font-bold">Green Trade</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Content de vous revoir !
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Connectez-vous pour accéder à votre compte et découvrir les produits frais de vos producteurs locaux.
          </p>
        </div>

        <div className="mt-auto relative z-10">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/20">
            <p className="text-white/95 mb-4 font-medium">
              🌱 Découvrez les nouveautés de la semaine : des fruits et légumes de saison cueillis à la main.
            </p>
            <p className="text-white/70 text-sm">
              Rejoignez plus de 5000 utilisateurs satisfaits
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden bg-[#4A7C59] text-white p-4 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[#A8D5BA]" />
            <span className="font-bold">Green Trade</span>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 p-6 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Back button desktop */}
            <button 
              onClick={() => router.push('/')} 
              className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </button>

            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-14 h-14 rounded-full bg-[#A8D5BA] flex items-center justify-center">
                  <Leaf className="h-7 w-7 text-[#4A7C59]" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
              <p className="text-gray-600">
                Connectez-vous pour accéder à votre compte Green Trade
              </p>
            </div>

            <form action={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="rounded-lg py-3"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a href="#" className="text-sm text-[#4A7C59] hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="rounded-lg py-3"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#4A7C59] hover:bg-[#3a6349] text-white py-6 text-lg rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#F8F9FA] text-gray-500">ou</span>
                </div>
              </div>

              {/* Create account */}
              <Button
                type="button"
                variant="outline"
                className="w-full py-6 text-lg rounded-xl border-[#4A7C59] text-[#4A7C59] hover:bg-[#A8D5BA]/20 hover:text-[#3a6349] transition-colors"
                onClick={() => router.push('/signup')}
              >
                Créer un compte
              </Button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-700 mb-2">Comptes de démonstration :</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• <span className="font-medium">john.doe@email.com</span> (utilisateur)</p>
                <p>• <span className="font-medium">admin@greentrade.fr</span> (admin)</p>
                <p>• <span className="font-medium">jean.dupont@email.com</span> (producteur)</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">Mot de passe : n'importe lequel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
