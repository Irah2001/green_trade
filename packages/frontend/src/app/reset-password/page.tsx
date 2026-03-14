'use client';

import Image from 'next/image';
import { Leaf, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth.service';
import greenTradeImg from '../../../public/images/green_trade.webp';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast({
        title: 'Token manquant',
        description: 'Le lien de réinitialisation est invalide.',
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    return regex.test(password);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { text: '', color: '' };
    if (password.length < 8) return { text: 'Trop court', color: 'text-red-600' };
    if (!validatePassword(password)) return { text: 'Faible', color: 'text-orange-600' };
    return { text: 'Fort', color: 'text-green-600' };
  };

  const handleSubmit = async () => {
    if (!token) {
      toast({
        title: 'Erreur',
        description: 'Token de réinitialisation manquant.',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      toast({
        title: 'Mot de passe invalide',
        description: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      setIsSuccess(true);
      toast({
        title: 'Succès',
        description: 'Votre mot de passe a été réinitialisé avec succès.',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-black text-white p-8 flex-col justify-between overflow-hidden">
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
            Nouveau mot de passe
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Choisissez un mot de passe sécurisé pour protéger votre compte Green Trade.
          </p>
        </div>

        <div className="mt-auto relative z-10">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/20">
            <p className="text-white/95 mb-4 font-medium">
              Votre mot de passe doit contenir :
            </p>
            <ul className="text-white/70 text-sm space-y-1">
              <li>Au moins 8 caractères</li>
              <li>Une lettre majuscule</li>
              <li>Une lettre minuscule</li>
              <li>Un chiffre</li>
              <li>Un caractère spécial</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="lg:hidden bg-[#4A7C59] text-white p-4 flex items-center gap-4">
          <button onClick={() => router.push('/login')} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[#A8D5BA]" />
            <span className="font-bold">Green Trade</span>
          </div>
        </div>

        <div className="flex-1 p-6 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <button 
              onClick={() => router.push('/login')} 
              className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </button>

            {isSuccess ? (
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-[#A8D5BA]/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-[#4A7C59]" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Mot de passe modifié</h2>
                <p className="text-gray-600 mb-8">
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#4A7C59] hover:bg-[#3a6349] text-white py-6 text-lg rounded-xl"
                >
                  Se connecter
                </Button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <div className="flex items-center justify-center lg:justify-start mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#A8D5BA] flex items-center justify-center">
                      <Leaf className="h-7 w-7 text-[#4A7C59]" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Réinitialiser le mot de passe</h2>
                  <p className="text-gray-600">
                    Saisissez votre nouveau mot de passe
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="rounded-lg py-3 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {newPassword && (
                      <p className={`text-sm ${passwordStrength.color}`}>
                        Force : {passwordStrength.text}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="rounded-lg py-3 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-sm text-red-600">
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-700 mb-2 font-medium">Exigences du mot de passe :</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                        Minimum 8 caractères
                      </li>
                      <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                        Une lettre majuscule
                      </li>
                      <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                        Une lettre minuscule
                      </li>
                      <li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>
                        Un chiffre
                      </li>
                      <li className={/[^a-zA-Z0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                        Un caractère spécial
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#4A7C59] hover:bg-[#3a6349] text-white py-6 text-lg rounded-xl"
                    disabled={isLoading || !newPassword || !confirmPassword}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Réinitialisation...
                      </>
                    ) : (
                      'Réinitialiser le mot de passe'
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
