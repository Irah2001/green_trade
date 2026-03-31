import { normalizeOrderStatus, type OrderStatus } from '@greentrade/shared'
import { apiFetch } from './api'

type OrderUser = {
  id?: string
  email?: string
  firstName?: string | null
  lastName?: string | null
}

type OrderProduct = {
  id?: string
  title?: string | null
  price?: number | null
  images?: string[] | null
}

export type OrderApiRow = {
  id: string
  buyerId?: string
  sellerId?: string
  productId?: string
  buyer?: OrderUser | null
  seller?: OrderUser | null
  product?: OrderProduct | null
  amount: number
  quantity: number
  status: string
  createdAt: string
}

export type OrderRow = {
  id: string
  buyerId: string
  sellerId: string
  productId: string
  buyer: OrderUser | null
  seller: OrderUser | null
  product: OrderProduct | null
  buyerLabel: string
  sellerLabel: string
  productTitle: string
  productImage: string
  amount: number
  quantity: number
  status: OrderStatus
  createdAt: string
}

const FALLBACK_IMAGE = '/images/green_trade.webp'

function formatUserLabel(user: OrderUser | null | undefined): string {
  if (!user) return '—'
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || '—'
}

type NormalizedOrderStatus = 'pending' | 'confirmed' | 'cancelled'

function isNormalizedOrderStatus(status: string | null | undefined): status is NormalizedOrderStatus {
  return status === 'pending' || status === 'confirmed' || status === 'cancelled'
}

export function normalizeOrderRow(order: OrderApiRow): OrderRow {
  return {
    id: order.id,
    buyerId: order.buyerId ?? '',
    sellerId: order.sellerId ?? '',
    productId: order.productId ?? '',
    buyer: order.buyer ?? null,
    seller: order.seller ?? null,
    product: order.product ?? null,
    buyerLabel: formatUserLabel(order.buyer),
    sellerLabel: formatUserLabel(order.seller),
    productTitle: order.product?.title ?? '—',
    productImage: order.product?.images?.[0] ?? FALLBACK_IMAGE,
    amount: Number(order.amount ?? 0),
    quantity: Number(order.quantity ?? 0),
    status: normalizeOrderStatus(order.status),
    createdAt: order.createdAt,
  }
}

export function getOrderStatusMeta(status: string) {
  switch (normalizeOrderStatus(status)) {
    case 'confirmed':
      return { label: 'Confirmée', className: 'bg-blue-500/10 text-blue-700 border-blue-500/20' }
    case 'cancelled':
      return { label: 'Annulée', className: 'bg-red-500/10 text-red-700 border-red-500/20' }
    case 'pending':
    default:
      return { label: 'En attente', className: 'bg-amber-500/10 text-amber-700 border-amber-500/20' }
  }
}

export function getOrderRoleLabel(order: { buyerId: string; sellerId: string }, currentUserId?: string | null) {
  if (!currentUserId) return 'Commande'
  if (order.buyerId === currentUserId) return 'Acheteur'
  if (order.sellerId === currentUserId) return 'Vendeur'
  return 'Commande'
}

export const orderService = {
  async getMyOrders(): Promise<{ orders: OrderRow[] }> {
    const response = await apiFetch<{ orders: OrderApiRow[] }>('/api/orders')
    return {
      orders: response.orders.map(normalizeOrderRow),
    }
  },
}
