"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { getSettingsNavItems } from '@/components/layout/settings-nav'
import { useIsClient } from "@/hooks/use-is-client"
import { useAppStore } from "@/store/useAppStore"

export default function SettingsSidebar() {
  const pathname = usePathname()
  const isMounted = useIsClient()
  const user = useAppStore((state) => state.user)
  const navItems = getSettingsNavItems(isMounted ? user?.role ?? null : null)

  return (
    <nav className="grid gap-1 text-sm text-muted-foreground w-full">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
