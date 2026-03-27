import { Shield, ShoppingBag, UserCircle, type LucideIcon } from 'lucide-react'

import type { BackendUser } from '@/types/user'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  roles?: BackendUser['role'][]
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Profil', href: '/settings/profile', icon: UserCircle },
  { title: 'Sécurité', href: '/settings/security', icon: Shield },
  { title: 'Commandes', href: '/settings/orders', icon: ShoppingBag },
  { title: 'Mes annonces', href: '/settings/listings', icon: ShoppingBag, roles: ['seller'] },
]

export function getSettingsNavItems(role?: BackendUser['role'] | null) {
  return NAV_ITEMS.filter((item) => !item.roles || (role ? item.roles.includes(role) : false))
}
