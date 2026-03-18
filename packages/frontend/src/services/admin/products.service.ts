import { apiFetch } from '@/services/api'
import type { AdminQueryResult } from './admin-capabilities'

interface BackendProduct {
  id: string
  sellerId: string
  title: string
  description: string
  price: number
  currency?: string
  category: string
  condition?: string
  images?: string[]
  location?: { city?: string; postalCode?: string; coordinates?: number[] } | null
  status: string
  tags?: string[]
  quantity?: number
  unit?: string
  views?: number
  createdAt?: string
  updatedAt?: string
}

export interface AdminProductRow {
  id: string
  title: string
  category: string
  price: number
  quantity: number
  unit: string
  status: string
  organic: boolean
  city: string
  createdAt: string
}

function toAdminProductRow(product: BackendProduct): AdminProductRow {
  return {
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price,
    quantity: product.quantity ?? 0,
    unit: product.unit ?? 'unité',
    status: product.status,
    organic: false,
    city: product.location?.city ?? '',
    createdAt: product.createdAt ?? '',
  }
}

export async function listAdminProducts(): Promise<AdminQueryResult<AdminProductRow[]>> {
  try {
    const response = await apiFetch<{ items: BackendProduct[]; total: number }>('/api/products?limit=100')
    return {
      data: response.items.map(toAdminProductRow),
      source: 'api',
    }
  } catch {
    return {
      data: [],
      source: 'unsupported',
      capabilityMessage: "Impossible de charger les produits. Vérifiez votre connexion.",
    }
  }
}

export async function getAdminProduct(id: string): Promise<AdminQueryResult<AdminProductRow | null>> {
  try {
    const product = await apiFetch<BackendProduct>(`/api/products/${id}`)
    return {
      data: toAdminProductRow(product),
      source: 'api',
    }
  } catch {
    return {
      data: null,
      source: 'unsupported',
      capabilityMessage: "Produit introuvable.",
    }
  }
}

export interface AdminProductFormValues {
  title: string
  description: string
  category: 'fruits' | 'vegetables' | 'baskets'
  price: number
  quantity: number
  unit: string
}

export async function createAdminProduct(
  values: AdminProductFormValues,
): Promise<AdminQueryResult<BackendProduct | null>> {
  try {
    const product = await apiFetch<BackendProduct>('/api/products', {
      method: 'POST',
      body: JSON.stringify(values),
    })
    return { data: product, source: 'api' }
  } catch (error: any) {
    return {
      data: null,
      source: 'unsupported',
      capabilityMessage: error.message || "Erreur lors de la création du produit.",
    }
  }
}

export async function updateAdminProduct(
  id: string,
  values: Partial<AdminProductFormValues>,
): Promise<AdminQueryResult<BackendProduct | null>> {
  try {
    const product = await apiFetch<BackendProduct>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
    })
    return { data: product, source: 'api' }
  } catch (error: any) {
    return {
      data: null,
      source: 'unsupported',
      capabilityMessage: error.message || "Erreur lors de la mise à jour du produit.",
    }
  }
}

export async function deleteAdminProduct(
  id: string,
): Promise<AdminQueryResult<null>> {
  try {
    await apiFetch(`/api/products/${id}`, { method: 'DELETE' })
    return { data: null, source: 'api' }
  } catch (error: any) {
    return {
      data: null,
      source: 'unsupported',
      capabilityMessage: error.message || "Erreur lors de la suppression du produit.",
    }
  }
}
