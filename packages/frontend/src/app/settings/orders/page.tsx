"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, PackageSearch, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useIsClient } from "@/hooks/use-is-client"
import { useAppStore } from "@/store/useAppStore"
import { getOrderRoleLabel, getOrderStatusMeta, orderService, type OrderRow } from "@/services/order.service"

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="border-muted shadow-none">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted animate-pulse" />
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

export default function OrdersSettingsPage() {
  const isMounted = useIsClient()
  const user = useAppStore((state) => state.user)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(isAuthenticated)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isMounted || !isAuthenticated) return

    let cancelled = false

    const loadOrders = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await orderService.getMyOrders()
        if (!cancelled) {
          setOrders(result.orders)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Impossible de charger vos commandes.')
          setOrders([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadOrders()

    return () => {
      cancelled = true
    }
  }, [isMounted, isAuthenticated])

  const currentUserId = user?.id ?? null

  const content = useMemo(() => {
    if (!isAuthenticated) {
      return (
        <Card className="border-muted shadow-none">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
            <div className="rounded-full bg-[#A8D5BA]/25 p-4 text-[#4A7C59]">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Connectez-vous pour voir vos commandes</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                L&apos;historique des commandes est accessible uniquement aux utilisateurs authentifiés.
              </p>
            </div>
            <Button asChild className="bg-[#4A7C59] text-white hover:bg-[#3a6349]">
              <Link href="/login">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (loading) {
      return <OrdersSkeleton />
    }

    if (error) {
      return (
        <Card className="border-muted shadow-none border-red-200">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
            <div className="rounded-full bg-red-50 p-4 text-red-600">
              <PackageSearch className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Impossible de charger les commandes</h3>
              <p className="text-sm text-muted-foreground max-w-md">{error}</p>
            </div>
            <Button
              onClick={() => {
                setLoading(true)
                orderService
                  .getMyOrders()
                  .then((result) => {
                    setOrders(result.orders)
                    setError('')
                  })
                  .catch((err) => setError(err instanceof Error ? err.message : 'Impossible de charger vos commandes.'))
                  .finally(() => setLoading(false))
              }}
              className="bg-[#4A7C59] text-white hover:bg-[#3a6349]"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (!orders.length) {
      return (
        <Card className="border-muted shadow-none">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
            <div className="rounded-full bg-[#A8D5BA]/25 p-4 text-[#4A7C59]">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Aucune commande</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Vos achats et ventes apparaîtront ici dès que vous aurez une transaction active.
              </p>
            </div>
            <Button asChild className="bg-[#4A7C59] text-white hover:bg-[#3a6349]">
              <Link href="/products">Découvrir les produits</Link>
            </Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => {
          const statusMeta = getOrderStatusMeta(order.status)
          const role = getOrderRoleLabel({ buyerId: order.buyerId, sellerId: order.sellerId }, currentUserId)

          return (
            <Card key={order.id} className="border-muted/50 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-[#A8D5BA]/80 bg-white/50 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="space-y-4 pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted relative group-hover:scale-105 transition-transform duration-500 ease-out">
                      <Image 
                        src={order.productImage} 
                        alt={order.productTitle} 
                        fill 
                        className="object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold leading-none">{order.productTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} · {order.quantity} article{order.quantity > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Commandé le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={statusMeta.className}>
                      {statusMeta.label}
                    </Badge>
                    <Badge variant="secondary" className="bg-[#A8D5BA]/30 text-[#4A7C59]">
                      {role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <Separator />
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-foreground">Acheteur :</span> {order.buyerLabel}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Vendeur :</span> {order.sellerLabel}
                  </div>
                  {order.carrier || order.trackingNumber ? (
                    <div className="sm:col-span-2">
                      <span className="font-medium text-foreground">Suivi :</span>{' '}
                      {[order.carrier, order.trackingNumber].filter(Boolean).join(' · ')}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Détail de la commande disponible bientôt.
                  </p>
                  <Button asChild className="bg-[#4A7C59] text-white hover:bg-[#3a6349]">
                    <Link href={`/settings/orders/${order.id}`}>
                      Voir détail
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }, [currentUserId, error, isAuthenticated, loading, orders])

  if (!isMounted) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Historique des commandes</h1>
        <p className="text-sm text-muted-foreground">
          Consultez toutes vos commandes en tant qu&apos;acheteur ou vendeur.
        </p>
      </div>

      <Separator />

      {content}
    </div>
  )
}
