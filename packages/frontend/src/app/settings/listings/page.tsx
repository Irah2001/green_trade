"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { PackageSearch, ShoppingBag, Trash2 } from "lucide-react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useIsClient } from "@/hooks/use-is-client"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/store/useAppStore"
import { normalizeProduct, productService } from "@/services/product.service"
import type { Product } from "@/types/models"

function ListingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="border-muted shadow-none">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ListingsSettingsPage() {
  const isMounted = useIsClient()
  const user = useAppStore((state) => state.user)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const deleteProduct = useAppStore((state) => state.deleteProduct)
  const { toast } = useToast()

  const [listings, setListings] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isSeller = user?.role === "seller"
  const isAuthorized = isAuthenticated && isSeller

  const fetchListings = useCallback(async (isSilent = false) => {
    if (!user?.id || !isAuthorized) {
      if (!isSilent) setLoading(false)
      setListings([])
      return
    }

    try {
      if (!isSilent) {
        setLoading(true)
        setError("")
      }
      
      const result = await productService.getProductsBySeller(user.id, { limit: 100 })
      const toProduct = normalizeProduct;
      const normalizedResult = result.items.map(toProduct);
      const processed = normalizedResult
        .filter((item: Product) => item.status === "active" || item.status === "reserved")
        .sort((a, b) => {
          if (a.status !== b.status) {
            return a.status === "active" ? -1 : 1
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

      setListings(processed)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger vos annonces.")
      setListings([])
    } finally {
      if (!isSilent) setLoading(false)
    }
  }, [user?.id, isAuthorized])

  useEffect(() => {
    if (!isMounted) return
    fetchListings()
  }, [isMounted, fetchListings])

  const handleDelete = async (product: Product) => {
    try {
      setDeletingId(product.id)
      const result = await deleteProduct(product.id)

      if (!result.success) {
        throw new Error(result.message ?? "Impossible de supprimer cette annonce.")
      }

      setListings((current) => current.filter((item) => item.id !== product.id))
      toast({
        title: "Annonce supprimée",
        description: `${product.title} a été retirée de vos annonces.`,
      })
    } catch (err) {
      toast({
        title: "Suppression impossible",
        description: err instanceof Error ? err.message : "Impossible de supprimer cette annonce.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
      setPendingDelete(null)
    }
  }

  if (!isMounted) return null

  const stats = {
    active: listings.filter((item) => item.status === "active").length,
    reserved: listings.filter((item) => item.status === "reserved").length,
    total: listings.length,
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Mes annonces</h1>
        <p className="text-sm text-muted-foreground">
          Gérez vos annonces actives et réservées depuis cet espace vendeur.
        </p>
      </div>

      {isAuthorized ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-muted shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Annonces actives</p>
              <p className="text-2xl font-semibold">{stats.active}</p>
            </CardContent>
          </Card>
          <Card className="border-muted shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Annonces réservées</p>
              <p className="text-2xl font-semibold">{stats.reserved}</p>
            </CardContent>
          </Card>
          <Card className="border-muted shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total affiché</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Separator />

      {!isAuthorized ? (
        <NoAccessState />
      ) : loading ? (
        <ListingsSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={() => fetchListings()} />
      ) : !listings.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {listings.map((product) => (
            <ListingCard
              key={product.id}
              product={product}
              isDeleting={deletingId === product.id}
              onDeleteClick={setPendingDelete}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. L&apos;annonce sera retirée du catalogue et de vos paramètres vendeur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-white text-black hover:bg-black hover:text-white"
              disabled={Boolean(deletingId)}>Annuler</AlertDialogCancel>
             <AlertDialogAction
              onClick={() => pendingDelete && handleDelete(pendingDelete)}
              disabled={Boolean(deletingId)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deletingId ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function NoAccessState() {
  return (
    <Card className="border-muted shadow-none">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <div className="rounded-full bg-light-green/25 p-4 text-olive">
          <PackageSearch className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Accès réservé aux vendeurs</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Cette section affiche uniquement les annonces publiées par un compte vendeur.
          </p>
        </div>
        <Button asChild className="bg-olive text-white hover:bg-olive-dark">
          <Link href="/settings/profile">Retour aux paramètres</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function ErrorState({ error, onRetry }: Readonly<{ error: string; onRetry: () => void }>) {
  return (
    <Card className="border-muted shadow-none">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-600">
          <PackageSearch className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Impossible de charger les annonces</h3>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
        <Button onClick={onRetry} className="bg-olive text-white hover:bg-olive-dark">
          Réessayer
        </Button>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="border-muted shadow-none">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <div className="rounded-full bg-light-green/25 p-4 text-olive">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Aucune annonce active</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Vos produits actifs et réservés apparaîtront ici dès qu&apos;une annonce sera publiée.
          </p>
        </div>
        <Button asChild className="bg-olive text-white hover:bg-olive-dark">
          <a href="/settings/profile">Gérer mon profil vendeur</a>
        </Button>
      </CardContent>
    </Card>
  )
}

function ListingCard({ 
  product, 
  isDeleting, 
  onDeleteClick 
}: Readonly<{ 
  product: Product; 
  isDeleting: boolean; 
  onDeleteClick: (p: Product) => void 
}>) {
  return (
    <Card key={product.id} className="border-muted/50 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-light-green/80 bg-white/50 backdrop-blur-sm group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted group-hover:scale-105 transition-transform duration-500 ease-out">
            <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold leading-none">{product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} · {product.quantity} disponible{product.quantity > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  Publié le {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-light-green bg-light-green/20 text-olive capitalize">
                  {product.status}
                </Badge>
                {product.organic ? <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Bio</Badge> : null}
              </div>
            </div>

            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div>
                <span className="font-medium text-foreground">Localisation :</span> {product.location.city}
              </div>
              <div>
                <span className="font-medium text-foreground">Catégorie :</span> {product.category}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {product.status === "reserved"
                  ? "Cette annonce est actuellement réservée."
                  : "Cette annonce est visible dans le catalogue public."}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="destructive"
                  className="bg-olive text-white hover:bg-olive-dark"
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDeleteClick(product)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
