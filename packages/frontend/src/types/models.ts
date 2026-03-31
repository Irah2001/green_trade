export interface SellerSummary {
  id: string;
  displayName: string;
  avatar?: string;
  city?: string;
  postalCode?: string;
  profile?: {
    avatar?: string;
    bio?: string;
  };
}

export interface Product {
  id: string;
  sellerId: string;
  seller?: SellerSummary | null;
  title: string;
  description: string;
  price: number;
  unit: string;
  category: 'fruits' | 'vegetables' | 'baskets';
  organic: boolean;
  images: string[];
  location: {
    city: string;
    postalCode: string;
    coordinates: [number, number];
    distance?: number;
  };
  status: 'active' | 'sold' | 'reserved';
  quantity: number;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  isSurplusOfDay?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
  unitPriceSnapshot?: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
