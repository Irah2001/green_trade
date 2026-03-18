export const ADMIN_RESOURCES = {
  orders: {
    key: 'orders' as const,
    label: 'Commandes',
    href: '/admin/orders',
    icon: 'ShoppingCart',
    description: 'Suivi centralisé des transactions marketplace.',
  },
  users: {
    key: 'users' as const,
    label: 'Utilisateurs',
    href: '/admin/users',
    icon: 'Users',
    description: 'Gestion des comptes utilisateurs.',
  },
  products: {
    key: 'products' as const,
    label: 'Produits',
    href: '/admin/products',
    icon: 'Package',
    description: 'Catalogue des produits publiés.',
  },
} as const

export type AdminResourceKey = keyof typeof ADMIN_RESOURCES

export const ADMIN_RESOURCE_KEYS = Object.keys(ADMIN_RESOURCES) as AdminResourceKey[]
