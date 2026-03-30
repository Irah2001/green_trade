'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, MapPin, Users, ArrowLeft } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// Store
import { useAppStore } from '@/store/useAppStore';

// Hooks
import { useToast } from '@/hooks/use-toast';

// Types
import { ClientFormData } from '@/types/client.type';
import { SellerFormData } from '@/types/seller.type';

// Images
import greenTradeImg from '../../../public/images/green_trade.webp';

type SignUpFormData = ClientFormData | SellerFormData;

const initialForm: SignUpFormData = {
  accountType: 'buyer',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  city: '',
  postalCode: '',
  acceptTerms: false,
  acceptNewsletter: false,
};

export default function SignUpPage() {
  const router = useRouter();
  const store = useAppStore();
  const { toast } = useToast();

  const [form, setForm] = useState<SignUpFormData>(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.acceptTerms) {
      toast({
        title: 'Erreur',
        description: 'Vous devez accepter les conditions générales',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const signup = store.signup;
      const result = await signup(form);

      if (result.success) {
        toast({
          title: 'Inscription réussie',
          description: 'Votre compte a été créé avec succès !',
        });
        store.setCurrentPage('home');
        router.push('/');
      } else {
        toast({
          title: "Erreur d'inscription",
          description: result.message || "Une erreur est survenue lors de la création du compte.",
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Signup failed', error);
      toast({
        title: 'Erreur technique',
        description: 'Le serveur ne répond pas.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image and text */}
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
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Leaf className="h-8 w-8 text-light-green" />
            <span className="text-xl font-bold">Green Trade</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Rejoignez la communauté des locavores
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Créez votre compte pour acheter des produits frais directement chez les producteurs de votre région et venir les récupérer sur place.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold text-lg">Produits locaux</p>
              <p className="text-white/70">Des producteurs près de chez vous</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold text-lg">Retrait chez le producteur</p>
              <p className="text-white/70">Récupérez vos produits directement sur place</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold text-lg">+150 producteurs</p>
              <p className="text-white/70">Déjà inscrits sur la plateforme</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
          <p className="text-white/90 italic">
            &quot;Grâce à Green Trade, je peux vendre mes surplus et éviter le gaspillage. Une vraie révolution pour les petits producteurs comme moi !&quot;
          </p>
          <p className="text-sm font-medium mt-2 text-light-green">— Jean Dupont, producteur à Nantes</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden bg-olive text-white p-4 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-light-green" />
            <span className="font-bold">Green Trade</span>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
          {/* Back button desktop */}
          <button 
            onClick={() => router.push('/')} 
            className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </button>

          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h2>
              <p className="text-gray-600">
                Remplissez le formulaire ci-dessous pour vous inscrire
              </p>
            </div>

            <form action={handleSubmit} className="space-y-5">
              {/* Account type */}
              <div className="space-y-2">
                <Label className="text-base">Type de compte</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, accountType: 'buyer' }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.accountType === 'buyer'
                        ? 'border-olive bg-light-green/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold">🛒 Acheteur</p>
                    <p className="text-xs text-gray-500">Acheter des produits locaux</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, accountType: 'seller' }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.accountType === 'seller'
                        ? 'border-olive bg-light-green/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold">🌾 Vendeur</p>
                    <p className="text-xs text-gray-500">Vendre vos produits</p>
                  </button>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    placeholder="Jean"
                    value={form.firstName}
                    onChange={(e) => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    placeholder="Dupont"
                    value={form.lastName}
                    onChange={(e) => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="rounded-lg"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={form.phone}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="rounded-lg"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    placeholder="Nantes"
                    value={form.city}
                    onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    placeholder="44000"
                    value={form.postalCode}
                    onChange={(e) => setForm(prev => ({ ...prev, postalCode: e.target.value }))}
                    required
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={8}
                  className="rounded-lg"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={form.acceptTerms}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, acceptTerms: checked as boolean }))}
                    className="mt-0.5 data-[state=checked]:bg-olive data-[state=checked]:border-olive"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                    En appuyant ici, vous confirmez avoir lu et accepté nos{' '}
                    <button type="button" className="text-olive hover:underline font-medium" onClick={() => toast({ title: 'Bientôt disponible', description: 'Les pages légales seront ajoutées prochainement.' })}>Conditions Générales</button>,{' '}
                    <button type="button" className="text-olive hover:underline font-medium" onClick={() => toast({ title: 'Bientôt disponible', description: 'Les pages légales seront ajoutées prochainement.' })}>CGV</button> et{' '}
                    <button type="button" className="text-olive hover:underline font-medium" onClick={() => toast({ title: 'Bientôt disponible', description: 'Les pages légales seront ajoutées prochainement.' })}>Politique de Confidentialité</button>.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="newsletter"
                    checked={form.acceptNewsletter}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, acceptNewsletter: checked as boolean }))}
                    className="mt-0.5 data-[state=checked]:bg-olive data-[state=checked]:border-olive"
                  />
                  <Label htmlFor="newsletter" className="text-sm font-normal leading-tight cursor-pointer">
                    J&apos;accepte de recevoir la newsletter Green Trade et les offres spéciales par email.
                  </Label>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-earth-orange hover:bg-earth-orange-dark text-white py-6 text-lg rounded-xl mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Création en cours...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </Button>

              {/* Switch to login */}
              <div className="text-center text-gray-600 pt-4">
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-olive hover:underline font-medium"
                >
                  Se connecter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
