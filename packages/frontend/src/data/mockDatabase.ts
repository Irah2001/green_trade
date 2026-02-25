// Mock data for Green Trade marketplace

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'producer';
  profile?: {
    avatar?: string;
    phone?: string;
    address?: string;
    bio?: string;
  };
  location?: {
    city: string;
    postalCode: string;
    coordinates: [number, number];
  };
  rating: number;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
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
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'paid' | 'delivered' | 'cancelled';
  deliveryMethod: 'pickup' | 'delivery';
  createdAt: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@email.com',
    passwordHash: 'hashed_password_john',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    profile: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      phone: '06 12 34 56 78',
      address: '15 rue de la Paix',
      bio: 'Passionné de cuisine locale'
    },
    location: {
      city: 'Nantes',
      postalCode: '44000',
      coordinates: [-1.5536, 47.2184]
    },
    rating: 4.8,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user-admin',
    email: 'admin@greentrade.fr',
    passwordHash: 'hashed_password_admin',
    firstName: 'Admin',
    lastName: 'Admin',
    role: 'admin',
    profile: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      phone: '06 00 00 00 00',
      address: '1 rue Admin'
    },
    location: {
      city: 'Paris',
      postalCode: '75000',
      coordinates: [2.3522, 48.8566]
    },
    rating: 5.0,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'producer-1',
    email: 'jean.dupont@email.com',
    passwordHash: 'hashed_password_jean',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'producer',
    profile: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jean',
      phone: '06 98 76 54 32',
      address: 'Ferme du Soleil, 42 route de Nantes',
      bio: 'Producteur bio depuis 20 ans. Mes légumes sont cultivés avec amour.'
    },
    location: {
      city: 'Nantes',
      postalCode: '44000',
      coordinates: [-1.5536, 47.2184]
    },
    rating: 4.9,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'producer-2',
    email: 'marie.martin@email.com',
    passwordHash: 'hashed_password_marie',
    firstName: 'Marie',
    lastName: 'Martin',
    role: 'producer',
    profile: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
      phone: '06 11 22 33 44',
      address: 'Le Verger de Marie, 8 chemin des Pommiers',
      bio: 'Fruits et légumes de saison, récoltés chaque matin.'
    },
    location: {
      city: 'Saint-Herblain',
      postalCode: '44800',
      coordinates: [-1.6325, 47.2132]
    },
    rating: 4.7,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'producer-3',
    email: 'pierre.bernard@email.com',
    passwordHash: 'hashed_password_pierre',
    firstName: 'Pierre',
    lastName: 'Bernard',
    role: 'producer',
    profile: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pierre',
      phone: '06 55 66 77 88',
      address: 'La Ferme Bio, 15 rue des Champs',
      bio: 'Agriculture biologique certifiée. Qualité et fraîcheur garanties.'
    },
    location: {
      city: 'Rennes',
      postalCode: '35000',
      coordinates: [-1.6808, 48.1173]
    },
    rating: 4.6,
    createdAt: '2026-01-01T00:00:00Z'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    sellerId: 'producer-1',
    title: 'Pommes Golden Bio',
    description: 'Pommes Golden bio de mon verger, récoltées ce matin. Parfaites pour des tartes ou à croquer. Saveur douce et sucrée.',
    price: 2.50,
    unit: 'kg',
    category: 'fruits',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Nantes',
      postalCode: '44000',
      coordinates: [-1.5536, 47.2184]
    },
    status: 'active',
    quantity: 15,
    tags: ['bio', 'pommes', 'fruits', 'local'],
    views: 142,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
    isSurplusOfDay: true
  },
  {
    id: 'prod-2',
    sellerId: 'producer-1',
    title: 'Tomates Cœur de Bœuf',
    description: 'Tomates cœur de bœuf charnues et savoureuses. Idéales pour les salades ou en cuisine. Récoltées à maturité.',
    price: 3.20,
    unit: 'kg',
    category: 'vegetables',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1724128239194-4bde5d240555?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Nantes',
      postalCode: '44000',
      coordinates: [-1.5536, 47.2184]
    },
    status: 'active',
    quantity: 8,
    tags: ['bio', 'tomates', 'légumes', 'local'],
    views: 89,
    createdAt: '2026-01-01T06:30:00Z',
    updatedAt: '2026-01-01T06:30:00Z',
    isSurplusOfDay: true
  },
  {
    id: 'prod-3',
    sellerId: 'producer-2',
    title: 'Courgettes Fraîches',
    description: 'Courgettes vertes tendres et croquantes. Parfaites pour les poêlées, gratins ou à consommer crues.',
    price: 1.80,
    unit: 'kg',
    category: 'vegetables',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1563252722-6434563a985d?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Saint-Herblain',
      postalCode: '44800',
      coordinates: [-1.6325, 47.2132]
    },
    status: 'active',
    quantity: 12,
    tags: ['bio', 'courgettes', 'légumes', 'local'],
    views: 67,
    createdAt: '2026-01-01T14:00:00Z',
    updatedAt: '2026-01-01T14:00:00Z',
    isSurplusOfDay: false
  },
  {
    id: 'prod-4',
    sellerId: 'producer-2',
    title: 'Fraises Gariguette',
    description: 'Fraises Gariguette parfumées et sucrées. Cueillies à la main ce matin. Délicieuses nature ou en dessert.',
    price: 4.50,
    unit: 'kg',
    category: 'fruits',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515686811547-3b4d40e3a6c7?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Saint-Herblain',
      postalCode: '44800',
      coordinates: [-1.6325, 47.2132]
    },
    status: 'active',
    quantity: 5,
    tags: ['bio', 'fraises', 'fruits', 'local', 'saison'],
    views: 203,
    createdAt: '2026-01-01T07:00:00Z',
    updatedAt: '2026-01-01T07:00:00Z',
    isSurplusOfDay: true
  },
  {
    id: 'prod-5',
    sellerId: 'producer-3',
    title: 'Carottes des Sables',
    description: 'Carottes des sables douces et croquantes. Cultivées en sol sablonneux pour une texture parfaite.',
    price: 1.50,
    unit: 'kg',
    category: 'vegetables',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Rennes',
      postalCode: '35000',
      coordinates: [-1.6808, 48.1173]
    },
    status: 'active',
    quantity: 20,
    tags: ['bio', 'carottes', 'légumes', 'local'],
    views: 45,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
    isSurplusOfDay: false
  },
  {
    id: 'prod-6',
    sellerId: 'producer-1',
    title: 'Panier Légumes de Saison',
    description: 'Panier composé de légumes de saison : tomates, courgettes, poivrons, aubergines. Idéal pour 4 personnes.',
    price: 12.00,
    unit: 'panier',
    category: 'baskets',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Nantes',
      postalCode: '44000',
      coordinates: [-1.5536, 47.2184]
    },
    status: 'active',
    quantity: 3,
    tags: ['bio', 'panier', 'légumes', 'saison', 'local'],
    views: 312,
    createdAt: '2026-01-01T09:00:00Z',
    updatedAt: '2026-01-01T09:00:00Z',
    isSurplusOfDay: true
  },
  {
    id: 'prod-7',
    sellerId: 'producer-3',
    title: 'Poivrons Rouges',
    description: 'Poivrons rouges charnus et sucrés. Parfaits pour les salades, grillades ou farcis.',
    price: 2.80,
    unit: 'kg',
    category: 'vegetables',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Rennes',
      postalCode: '35000',
      coordinates: [-1.6808, 48.1173]
    },
    status: 'active',
    quantity: 10,
    tags: ['bio', 'poivrons', 'légumes', 'local'],
    views: 78,
    createdAt: '2026-01-01T16:00:00Z',
    updatedAt: '2026-01-01T16:00:00Z',
    isSurplusOfDay: false
  },
  {
    id: 'prod-8',
    sellerId: 'producer-2',
    title: 'Aubergines Violettes',
    description: 'Aubergines bien fermes et brillantes. Idéales pour les gratins, ratatouilles ou cuites au four.',
    price: 2.20,
    unit: 'kg',
    category: 'vegetables',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1528826007177-f38517ce9a8a?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Saint-Herblain',
      postalCode: '44800',
      coordinates: [-1.6325, 47.2132]
    },
    status: 'active',
    quantity: 7,
    tags: ['bio', 'aubergines', 'légumes', 'local'],
    views: 56,
    createdAt: '2026-01-01T05:00:00Z',
    updatedAt: '2026-01-01T05:00:00Z',
    isSurplusOfDay: false
  },
  {
    id: 'prod-9',
    sellerId: 'producer-1',
    title: 'Poires Conference',
    description: 'Poires Conference fondantes et juteuses. Récoltées à point pour une saveur optimale.',
    price: 2.80,
    unit: 'kg',
    category: 'fruits',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Nantes',
      postalCode: '44000',
      coordinates: [-1.5536, 47.2184]
    },
    status: 'active',
    quantity: 10,
    tags: ['bio', 'poires', 'fruits', 'local'],
    views: 91,
    createdAt: '2026-01-01T11:00:00Z',
    updatedAt: '2026-01-01T11:00:00Z',
    isSurplusOfDay: false
  },
  {
    id: 'prod-10',
    sellerId: 'producer-3',
    title: 'Panier Fruité',
    description: 'Panier de fruits variés : pommes, poires, fraises. Parfait pour la famille ou à offrir.',
    price: 15.00,
    unit: 'panier',
    category: 'baskets',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Rennes',
      postalCode: '35000',
      coordinates: [-1.6808, 48.1173]
    },
    status: 'active',
    quantity: 4,
    tags: ['bio', 'panier', 'fruits', 'local'],
    views: 187,
    createdAt: '2026-01-01T12:00:00Z',
    updatedAt: '2026-01-01T12:00:00Z',
    isSurplusOfDay: false
  },
  {
    id: 'prod-11',
    sellerId: 'producer-2',
    title: 'Radis Roses',
    description: 'Radis roses croquants et légèrement piquants. À croquer avec du beurre salé, un délice breton !',
    price: 1.20,
    unit: 'botte',
    category: 'vegetables',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1595855759920-86582396756a?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Saint-Herblain',
      postalCode: '44800',
      coordinates: [-1.6325, 47.2132]
    },
    status: 'active',
    quantity: 15,
    tags: ['bio', 'radis', 'légumes', 'local'],
    views: 34,
    createdAt: '2026-01-01T06:00:00Z',
    updatedAt: '2026-01-01T06:00:00Z',
    isSurplusOfDay: false
  },
  {
    id: 'prod-12',
    sellerId: 'producer-1',
    title: 'Salade Batavia',
    description: 'Salades Batavia croquantes et fraîches. Idéales pour vos salades d\'été.',
    price: 0.90,
    unit: 'pièce',
    category: 'vegetables',
    organic: true,
    images: [
      'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&h=600&fit=crop'
    ],
    location: {
      city: 'Nantes',
      postalCode: '44000',
      coordinates: [-1.5536, 47.2184]
    },
    status: 'active',
    quantity: 25,
    tags: ['bio', 'salade', 'légumes', 'local'],
    views: 123,
    createdAt: '2026-01-01T07:30:00Z',
    updatedAt: '2026-01-01T07:30:00Z',
    isSurplusOfDay: true
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    buyerId: 'user-1',
    sellerId: 'producer-1',
    productId: 'prod-1',
    quantity: 3,
    amount: 7.50,
    status: 'paid',
    deliveryMethod: 'pickup', 
    createdAt: '2026-01-01T14:00:00Z'
  },
  {
    id: 'order-2',
    buyerId: 'user-1',
    sellerId: 'producer-2',
    productId: 'prod-4',
    quantity: 1,
    amount: 4.50,
    status: 'delivered',
    deliveryMethod: 'pickup',
    createdAt: '2026-01-01T10:00:00Z'
  },
  {
    id: 'order-3',
    buyerId: 'user-admin',
    sellerId: 'producer-1',
    productId: 'prod-6',
    quantity: 1,
    amount: 12.00,
    status: 'pending',
    deliveryMethod: 'delivery',
    createdAt: '2026-01-01T16:00:00Z'
  }
];

// Helper functions
export const getSellerById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category && product.status === 'active');
};

export const getSurplusOfDayProducts = (): Product[] => {
  return mockProducts.filter(product => product.isSurplusOfDay && product.status === 'active');
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.status === 'active' && (
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  );
};
