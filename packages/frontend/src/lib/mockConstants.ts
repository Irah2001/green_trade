export type User = {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  location?: { city: string; lat: number; lng: number };
  rating?: number;
};

export type Product = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  category: 'fruits' | 'vegetables' | 'baskets';
  condition: string;
  status: 'active' | 'sold';
  images: string[];
  location: { city: string; lat: number; lng: number; distance: number };
  tags: string[];
  availableQuantity: number;
  organic?: boolean;
  isSurplusOfDay?: boolean;
  quantity?: number;
  createdAt?: string;
};

export const MOCK_USERS: Record<string, User> = {
  'u1': { id: 'u1', firstName: 'John', lastName: 'Doe', location: { city: 'Nantes', lat: 47.2184, lng: -1.5536 }, rating: 4.8 },
  'uA': { id: 'uA', firstName: 'Admin', lastName: 'Admin' },
  'u2': { id: 'u2', firstName: 'Jean', lastName: 'Dupont', location: { city: 'Nantes', lat: 47.2284, lng: -1.5336 }, rating: 4.9 },
  'u3': { id: 'u3', firstName: 'Marie', lastName: 'Curie', location: { city: 'Rennes', lat: 48.1173, lng: -1.6778 }, rating: 5.0 },
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 'u2',
    title: 'Pommes Golden du Verger Bio',
    description: 'Petite récolte de ce matin, pommes très sucrées et sans traitement. Parfaites pour les compotes ou en croquant !',
    price: 2.0,
    unit: 'kg',
    category: 'fruits',
    condition: 'surplus',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6caa6?q=80&w=2000&auto=format&fit=crop'],
    location: { city: 'Nantes', distance: 2.5, lat: 47.2184, lng: -1.5536 },
    tags: ['bio', 'surplus', 'local'],
    availableQuantity: 5,
  },
  {
    id: 'p2',
    sellerId: 'u1',
    title: 'Tomates Cerises du Jardin',
    description: 'Une explosion de saveurs en bouche. Idéal pour l\'apéritif ou vos salades.',
    price: 3.5,
    unit: 'kg',
    category: 'vegetables',
    condition: 'surplus',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2000&auto=format&fit=crop'],
    location: { city: 'Nantes', distance: 1.2, lat: 47.2184, lng: -1.5536 },
    tags: ['sans-pesticide', 'cueilli-ce-matin'],
    availableQuantity: 2,
  },
  {
    id: 'p3',
    sellerId: 'u3',
    title: 'Courgettes Longues Vertes',
    description: 'Des courgettes fraîchement cueillies, parfaites pour une poêlée ou un gratin d\'été.',
    price: 1.8,
    unit: 'kg',
    category: 'vegetables',
    condition: 'surplus',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=2000&auto=format&fit=crop'],
    location: { city: 'Rennes', distance: 15, lat: 48.1173, lng: -1.6778 },
    tags: ['jardin', 'surplus'],
    availableQuantity: 8,
  },
  {
    id: 'p4',
    sellerId: 'u2',
    title: 'Panier Anti-gaspillage Légumes',
    description: 'Un lot de légumes de saison légèrement imparfaits ou moches mais tout aussi délicieux.',
    price: 5.0,
    unit: 'panier',
    category: 'baskets',
    condition: 'surplus',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop'],
    location: { city: 'Nantes', distance: 3.0, lat: 47.2184, lng: -1.5536 },
    tags: ['anti-gaspi', 'mix'],
    availableQuantity: 3,
  },
  {
    id: 'p5',
    sellerId: 'u1',
    title: 'Épinards Frais en Branche',
    description: 'Jeunes pousses d\'épinards pleines de fer et douces.',
    price: 2.5,
    unit: 'botte',
    category: 'vegetables',
    condition: 'surplus',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2000&auto=format&fit=crop'],
    location: { city: 'Nantes', distance: 1.0, lat: 47.2184, lng: -1.5536 },
    tags: ['vitamines', 'bio'],
    availableQuantity: 10,
  },
  {
    id: 'p6',
    sellerId: 'u2',
    title: 'Grosses Potirons',
    description: 'Prêt pour la soupe avec la fraîcheur qui arrive.',
    price: 3.0,
    unit: 'pièce',
    category: 'vegetables',
    condition: 'surplus',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1509522146496-58f1f5025ea5?q=80&w=2000&auto=format&fit=crop'],
    location: { city: 'Nantes', distance: 4.0, lat: 47.2184, lng: -1.5536 },
    tags: ['automne', 'soupe'],
    availableQuantity: 4,
  },
  {
    id: 'p7',
    sellerId: 'u3',
    title: 'Poires Conférence',
    description: 'Très juteuses, idéales en fin de repas.',
    price: 2.2,
    unit: 'kg',
    category: 'fruits',
    condition: 'surplus',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1627915570889-72c676d08af6?q=80&w=2000&auto=format&fit=crop'],
    location: { city: 'Rennes', distance: 18, lat: 48.1173, lng: -1.6778 },
    tags: ['verger', 'sucré'],
    availableQuantity: 6,
  },
  {
    id: 'p8',
    sellerId: 'u1',
    title: 'Fraises Gariguette',
    description: 'Toute première récolte, un parfum exceptionnel.',
    price: 4.5,
    unit: 'barquette',
    category: 'fruits',
    condition: 'surplus',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2000&auto=format&fit=crop'],
    location: { city: 'Nantes', distance: 0.5, lat: 47.2184, lng: -1.5536 },
    tags: ['gourmand', 'dessert'],
    availableQuantity: 1,
  }
];
