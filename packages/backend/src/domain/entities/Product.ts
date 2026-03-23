export type PublicSellerSummary = {
  id: string;
  displayName: string;
  avatar?: string;
  city?: string;
  postalCode?: string;
  profile?: {
    avatar?: string;
    bio?: string;
    phone?: string;
    address?: string;
  };
};

export type ProductProps = {
  id?: string;
  sellerId: string;
  seller?: PublicSellerSummary | null;
  title: string;
  description: string;
  price: number;
  currency?: string;
  category: string;
  condition: 'neuf' | 'excellent' | 'bon' | 'acceptable';
  images?: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    city?: string;
    postalCode?: string;
  };
  status?: 'active' | 'sold' | 'reserved' | 'archived';
  tags?: string[];
  quantity?: number;
  unit?: string;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export const toPublicSellerSummary = (seller: any): PublicSellerSummary | null => {
  if (!seller) {
    return null;
  }

  const firstName = typeof seller.firstName === 'string' ? seller.firstName : '';
  const lastName = typeof seller.lastName === 'string' ? seller.lastName : '';
  const displayName = seller.displayName ?? `${firstName} ${lastName}`.trim();

  const summary: PublicSellerSummary = {
    id: seller.id,
    displayName: displayName || seller.email || 'Vendeur',
  };

  if (seller.avatar ?? seller.profile?.avatar) {
    summary.avatar = seller.avatar ?? seller.profile?.avatar;
  }

  if (seller.city ?? seller.location?.city) {
    summary.city = seller.city ?? seller.location?.city;
  }

  if (seller.postalCode ?? seller.location?.postalCode) {
    summary.postalCode = seller.postalCode ?? seller.location?.postalCode;
  }

  if (seller.profile) {
    const profile = {
      ...(seller.profile.avatar ? { avatar: seller.profile.avatar } : {}),
      ...(seller.profile.bio ? { bio: seller.profile.bio } : {}),
      ...(seller.profile.phone ? { phone: seller.profile.phone } : {}),
      ...(seller.profile.address ? { address: seller.profile.address } : {}),
    };

    if (Object.keys(profile).length > 0) {
      summary.profile = profile;
    }
  }

  return summary;
};

export class Product {
  private props: ProductProps;

  constructor(props: ProductProps) {
    if (!props.title || props.title.length < 3) {
      throw new Error('Title too short');
    }
    if (props.price <= 0) {
      throw new Error('Price must be positive');
    }
    this.props = {
      ...props,
      status: props.status ?? 'active',
      views: props.views ?? 0,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }

  get sellerId() {
    return this.props.sellerId;
  }

  get seller() {
    return this.props.seller ?? null;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get price() {
    return this.props.price;
  }

  get currency() {
    return this.props.currency ?? 'EUR';
  }

  get category() {
    return this.props.category;
  }

  get condition() {
    return this.props.condition;
  }

  get images() {
    return this.props.images ?? [];
  }

  get location() {
    return this.props.location;
  }

  get status() {
    return this.props.status!;
  }

  get quantity() {
    return this.props.quantity ?? 0;
  }

  get unit() {
    return this.props.unit ?? 'unité';
  }

  get views() {
    return this.props.views ?? 0;
  }

  toJSON() {
    return {
      ...this.props,
      seller: this.props.seller ? { ...this.props.seller } : null,
    };
  }
}
