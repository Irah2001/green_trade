'use client';

import { useState } from 'react';
import { Leaf, Mail, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// X (Twitter) icon component
function XIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.2-1.5 1.5-1.5h1.8V4a24 24 0 0 0-2.6-.1c-2.6 0-4.4 1.6-4.4 4.5v2.2H7v3.2h2.8V22h3.7Z" />
    </svg>
  );
}

function InstagramIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.81 4.81 0 0 1 12 7.2Zm0 2a2.8 2.8 0 1 0 2.8 2.8A2.8 2.8 0 0 0 12 9.2ZM17.8 6.9a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2Z" />
    </svg>
  );
}

// TikTok icon component
function TikTokIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4004);
    }
  };

  return (
    <footer className="bg-olive text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-light-green" />
              <span className="text-xl font-bold">Green Trade</span>
            </div>
            <p className="text-white/80 text-sm">
              La marketplace locale pour acheter et vendre vos produits frais directement aux producteurs.
            </p>
            <div className="flex gap-4">
              <button type="button" aria-label="Facebook" className="text-white/60 hover:text-white transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </button>
              <button type="button" aria-label="X" className="text-white/60 hover:text-white transition-colors">
                <XIcon className="h-5 w-5" />
              </button>
              <button type="button" aria-label="TikTok" className="text-white/60 hover:text-white transition-colors">
                <TikTokIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-light-green">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-white text-sm transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/?category=fruits" className="text-white/80 hover:text-white text-sm transition-colors">
                  Fruits
                </Link>
              </li>
              <li>
                <Link href="/?category=vegetables" className="text-white/80 hover:text-white text-sm transition-colors">
                  Légumes
                </Link>
              </li>
              <li>
                <Link href="/?category=baskets" className="text-white/80 hover:text-white text-sm transition-colors">
                  Paniers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-light-green">Légal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/terms" className="text-white/80 hover:text-white text-sm transition-colors">
                  Conditions Générales
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-white/80 hover:text-white text-sm transition-colors">
                  Politique de Confidentialité
                </a>
              </li>
              <li>
                <a href="/legal-notice" className="text-white/80 hover:text-white text-sm transition-colors">
                  Mentions Légales
                </a>
              </li>
              <li>
                <a href="/cgv" className="text-white/80 hover:text-white text-sm transition-colors">
                  CGV
                </a>
              </li>
              <li>
                <a href="/cgu-producteurs" className="text-white/80 hover:text-white text-sm transition-colors">
                  CGU Producteurs
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-light-green">Newsletter</h3>
            <p className="text-white/80 text-sm mb-4">
              Inscrivez-vous pour recevoir nos offres et actualités
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleSubscribe(); }} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-light-green"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-earth-orange hover:bg-earth-orange-dark text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubscribed ? 'Inscrit !' : "S'inscrire"}
              </Button>
            </form>
          </div>
        </div>

        {/* Partners */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-center text-white/60 text-sm mb-4">Nos producteurs partenaires</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 mx-auto">
                <span className="text-lg">🌾</span>
              </div>
              <p className="text-xs text-white/60">Ferme du Soleil</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 mx-auto">
                <span className="text-lg">🍎</span>
              </div>
              <p className="text-xs text-white/60">Le Verger de Marie</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 mx-auto">
                <span className="text-lg">🥕</span>
              </div>
              <p className="text-xs text-white/60">La Ferme Bio</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 mx-auto">
                <span className="text-lg">🌻</span>
              </div>
              <p className="text-xs text-white/60">Jardins de Loire</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © 2026 Green Trade. Tous droits réservés. Fait avec 💚 pour les producteurs locaux.
            </p>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-light-green" />
                <span>France</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-light-green" />
                <a href="mailto:contact@greentrade.fr" className="hover:text-white transition-colors">
                  contact@greentrade.fr
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
