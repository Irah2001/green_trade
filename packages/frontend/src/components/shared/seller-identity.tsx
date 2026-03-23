import Image from 'next/image';
import { MapPin } from 'lucide-react';

import type { SellerSummary } from '@/types/models';
import type { PublicUser } from '@/types/user';
import { getUserDisplayName, getUserCity, getUserAvatar } from '@/types/user';

type SellerIdentitySource = SellerSummary | PublicUser | null;

interface SellerIdentityProps {
  seller: SellerIdentitySource;
  fallbackCity?: string;
}

const getSellerDisplayName = (seller: SellerIdentitySource) => {
  if (!seller) return 'Vendeur indisponible';

  const name = getUserDisplayName(seller);
  return name || 'Vendeur indisponible';
};

const getSellerCity = (seller: SellerIdentitySource, fallbackCity?: string) => {
  if (!seller) return fallbackCity ?? 'Ville inconnue';

  return getUserCity(seller) || (fallbackCity ?? 'Ville inconnue');
};

const getSellerAvatar = (seller: SellerIdentitySource) => {
  if (!seller) return '';

  return getUserAvatar(seller);
};

export default function SellerIdentity({ seller, fallbackCity }: Readonly<SellerIdentityProps>) {
  const name = getSellerDisplayName(seller);
  const city = getSellerCity(seller, fallbackCity);
  const avatar = getSellerAvatar(seller);
  const avatarSeed = seller?.id ?? 'default';

  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-light-green shrink-0">
        <Image
          src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
          alt={name}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 leading-tight">
          {name}
        </span>
        <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
          <MapPin className="h-3 w-3" />
          <span>{city}</span>
        </div>
      </div>
    </div>
  );
}
