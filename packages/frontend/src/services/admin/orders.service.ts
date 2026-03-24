import { apiFetch } from '@/services/api'
import type { AdminQueryResult } from './admin-capabilities'

export interface AdminOrderRow {
  id: string
  buyerName: string
  productTitle: string
  status: string
  amount: number
  quantity: number
  deliveryMethod: string
  createdAt: string
}

function toAdminOrderRow(order: {
  id: string
  buyer?: { firstName?: string | null; lastName?: string | null; email?: string } | null
  product?: { title?: string | null } | null
  status: string
  amount: number
  quantity: number
  deliveryMethod?: string
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
    status: order.status,
    amount: order.amount,
    quantity: order.quantity,
    deliveryMethod: order.deliveryMethod ?? 'delivery',
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
      deliveryMethod?: string
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
      deliveryMethod?: string
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
