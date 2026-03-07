'use client';

import Image from 'next/image';
import { Leaf, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Images
import greenTradeImg from '../../../public/images/green_trade.webp';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    setIsLoading(true);

    try {
      // Simulation of a backend request
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation", error);
    } finally {
      setIsLoading(false);
    }
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
            Mot de passe oublié ?
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Pas de panique, ça arrive aux meilleurs d'entre nous. Entrez votre adresse e-mail pour réinitialiser votre mot de passe.
          </p>
        </div>

        <div className="mt-auto relative z-10">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/20 flex items-center">
            <p className="text-white/95 font-medium m-0 text-left">
              🌱 Astuce : Pensez à vérifier vos courriers indésirables ou spams.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden bg-[#4A7C59] text-white p-4 flex items-center gap-4">
          <button onClick={() => router.push('/login')} className="p-2 hover:bg-white/10 rounded-lg">
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
              onClick={() => router.push('/login')}
              className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </button>

            {isSuccess ? (
              // Success State
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-[#A8D5BA]/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-[#4A7C59]" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">E-mail envoyé !</h2>
                <p className="text-gray-600 mb-8">
                  Si le compte <span className="font-medium text-gray-900">{email}</span> existe, vous recevrez un lien pour réinitialiser votre mot de passe dans quelques instants.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#4A7C59] hover:bg-[#3a6349] text-white py-6 text-lg rounded-xl"
                >
                  Retour à la connexion
                </Button>
              </div>
            ) : (
              // Form State
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <div className="flex items-center justify-center lg:justify-start mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#A8D5BA] flex items-center justify-center">
                      <Leaf className="h-7 w-7 text-[#4A7C59]" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Réinitialisation</h2>
                  <p className="text-gray-600">
                    Saisissez l'e-mail associé à votre compte.
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-lg py-3"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#4A7C59] hover:bg-[#3a6349] text-white py-6 text-lg rounded-xl"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Envoi du lien...
                      </>
                    ) : (
                      'Envoyer le lien'
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
