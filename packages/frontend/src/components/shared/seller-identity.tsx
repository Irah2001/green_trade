import Image from 'next/image';
import { MapPin } from 'lucide-react';

import type { BackendUser } from '@/types/user';
import type { SellerSummary } from '@/types/models';
import { getUserDisplayName, getUserCity, getUserAvatar } from '@/types/user';

type SellerIdentitySource = SellerSummary | BackendUser | null;

interface SellerIdentityProps {
  seller: SellerIdentitySource;
  fallbackCity?: string;
}

const getSellerDisplayName = (seller: SellerIdentitySource) => {
  if (!seller) return 'Vendeur indisponible';

  if ('displayName' in seller && seller.displayName) {
    return seller.displayName;
  }

  if ('firstName' in seller || 'lastName' in seller) {
    return getUserDisplayName(seller as BackendUser);
  }

  return 'Vendeur indisponible';
};

const getSellerCity = (seller: SellerIdentitySource, fallbackCity?: string) => {
  if (!seller) return fallbackCity ?? 'Ville inconnue';

  if ('city' in seller && seller.city) {
    return seller.city;
  }

  if ('location' in seller && seller.location?.city) {
    return getUserCity(seller as BackendUser);
  }

  return fallbackCity ?? 'Ville inconnue';
};

const getSellerAvatar = (seller: SellerIdentitySource) => {
  if (!seller) return '';

  if ('avatar' in seller && seller.avatar) {
    return seller.avatar;
  }

  return getUserAvatar(seller as BackendUser);
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
