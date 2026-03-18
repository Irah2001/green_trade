'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ADMIN_RESOURCES, type AdminResourceKey } from '@/features/admin/config/admin-resources'
import { ShoppingCart, Users, Package } from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingCart,
  Users,
  Package,
}

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-1 rounded-xl border bg-card p-3">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Administration
      </p>
      {(Object.entries(ADMIN_RESOURCES) as [AdminResourceKey, (typeof ADMIN_RESOURCES)[AdminResourceKey]][]).map(
        ([, resource]) => {
          const Icon = ICON_MAP[resource.icon]
          const isActive = pathname?.startsWith(resource.href)
          return (
            <Link
              key={resource.key}
              href={resource.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[#4A7C59]/10 text-[#4A7C59] font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {resource.label}
            </Link>
          )
        },
      )}
    </aside>
  )
}
