'use client'

import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
// UI
import { Button } from '@/components/ui/button'
// Components
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AdminSidebar from '@/components/admin/AdminSidebar'

import { useAppStore } from '@/store/useAppStore'
import { useIsClient } from '@/hooks/use-is-client'


function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = useAppStore((state) => state.user)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
            <h1 className="text-xl font-semibold">Accès refusé</h1>
            <p className="text-sm text-muted-foreground">
              Vous devez être connecté en tant qu&apos;administrateur pour accéder à cette section.
            </p>
            <Button asChild className="bg-olive hover:bg-olive-dark text-white">
              <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-6">
          <AdminSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isMounted = useIsClient()

  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Chargement de votre espace admin...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return <AdminShell>{children}</AdminShell>
}
