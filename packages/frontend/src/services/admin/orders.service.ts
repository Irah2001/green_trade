import { apiFetch } from '@/services/api'
import type { AdminQueryResult } from './admin-capabilities'

const LEGACY_CONFIRMED_STATUSES = new Set(['paid'])

function normalizeOrderStatus(status: string): string {
  if (status === 'pending' || status === 'confirmed' || status === 'cancelled') return status
  if (LEGACY_CONFIRMED_STATUSES.has(status)) return 'confirmed'
  return 'pending'
}

export interface AdminOrderRow {
  id: string
  buyerName: string
  productTitle: string
  status: string
  amount: number
  quantity: number
  createdAt: string
}

function toAdminOrderRow(order: {
  id: string
  buyer?: { firstName?: string | null; lastName?: string | null; email?: string } | null
  product?: { title?: string | null } | null
  status: string
  amount: number
  quantity: number
  createdAt: string
}): AdminOrderRow {
  const buyerName = order.buyer
    ? [order.buyer.firstName, order.buyer.lastName].filter(Boolean).join(' ') || order.buyer.email || '—'
    : '—'
  const productTitle = order.product?.title ?? '—'

  return {
    id: order.id,
    buyerName,
    productTitle,
      status: normalizeOrderStatus(order.status),
    amount: order.amount,
    quantity: order.quantity,
    createdAt: order.createdAt,
  }
}

export async function listAdminOrders(): Promise<AdminQueryResult<AdminOrderRow[]>> {
  try {
    const response = await apiFetch<{ orders: Array<{
      id: string
      buyer?: { firstName?: string | null; lastName?: string | null; email?: string } | null
      product?: { title?: string | null } | null
      status: string
      amount: number
      quantity: number
      createdAt: string
    }> }>('/api/admin/orders')
    return {
      data: response.orders.map(toAdminOrderRow),
      source: 'api',
    }
  } catch {
    return {
      data: [],
      source: 'unsupported',
      capabilityMessage: "Impossible de charger les commandes. Vérifiez votre connexion.",
    }
  }
}

export async function getAdminOrder(id: string): Promise<AdminQueryResult<AdminOrderRow | null>> {
  try {
    const response = await apiFetch<{ order: {
      id: string
      buyer?: { firstName?: string | null; lastName?: string | null; email?: string } | null
      product?: { title?: string | null } | null
      status: string
      amount: number
      quantity: number
      createdAt: string
    } }>(`/api/orders/${id}`)
    return {
      data: toAdminOrderRow(response.order),
      source: 'api',
    }
  } catch {
    return {
      data: null,
      source: 'unsupported',
      capabilityMessage: "Commande introuvable.",
    }
  }
}
