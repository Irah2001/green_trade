import { Shield, ShoppingBag, UserCircle, type LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Profil', href: '/settings/profile', icon: UserCircle },
  { title: 'Sécurité', href: '/settings/security', icon: Shield },
  { title: 'Commandes', href: '/settings/orders', icon: ShoppingBag },
]
