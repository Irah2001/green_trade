"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type LucideIcon, UserCircle, Shield } from "lucide-react"

import { cn } from "@/lib/utils"

/** Represents a single navigation item in the settings sidebar. */
interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { title: "Profil", href: "/settings/profile", icon: UserCircle },
  { title: "Sécurité", href: "/settings/security", icon: Shield },
]

export default function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1 text-sm text-muted-foreground w-full">
      {NAV_ITEMS.map((item) => {
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
