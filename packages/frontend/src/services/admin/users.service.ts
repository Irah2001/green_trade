import { apiFetch } from '@/services/api'
import type { AdminQueryResult } from './admin-capabilities'

export interface AdminUserRow {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  city: string
  rating: number
  createdAt: string
}

function toAdminUserRow(user: {
  id: string
  firstName?: string | null
  lastName?: string | null
  email: string
  role: string
  city?: string | null
  rating?: number | null
  createdAt: string
}): AdminUserRow {
  return {
    id: user.id,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email,
    role: user.role,
    city: user.city ?? '',
    rating: user.rating ?? 0,
    createdAt: user.createdAt,
  }
}

export async function listAdminUsers(): Promise<AdminQueryResult<AdminUserRow[]>> {
  try {
    const users = await apiFetch<Array<{
      id: string
      firstName?: string | null
      lastName?: string | null
      email: string
      role: string
      city?: string | null
      rating?: number | null
      createdAt: string
    }>>('/api/users')
    return {
      data: users.map(toAdminUserRow),
      source: 'api',
    }
  } catch {
    return {
      data: [],
      source: 'unsupported',
      capabilityMessage: "Impossible de charger les utilisateurs. Vérifiez votre connexion ou vos droits admin.",
    }
  }
}

export async function getAdminUser(id: string): Promise<AdminQueryResult<AdminUserRow | null>> {
  try {
    const user = await apiFetch<{
      id: string
      firstName?: string | null
      lastName?: string | null
      email?: string
      role: string
      city?: string | null
      rating?: number | null
      createdAt: string
    }>(`/api/users/${id}`)
    return {
      data: toAdminUserRow({ ...user, email: user.email ?? '' }),
      source: 'api',
    }
  } catch {
    return {
      data: null,
      source: 'unsupported',
      capabilityMessage: "Impossible de charger ce profil.",
    }
  }
}

export interface AdminUserUpdatePayload {
  firstName?: string
  lastName?: string
  role?: 'buyer' | 'seller' | 'farmer' | 'admin'
  phone?: string | null
  city?: string | null
  postalCode?: string | null
  profile?: Record<string, unknown>
}

export async function updateAdminUser(
  id: string,
  data: AdminUserUpdatePayload,
): Promise<AdminQueryResult<AdminUserRow | null>> {
  try {
    const response = await apiFetch<{ message: string; user: {
      id: string
      firstName?: string | null
      lastName?: string | null
      email: string
      role: string
      city?: string | null
      rating?: number | null
      createdAt: string
    } }>(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return {
      data: toAdminUserRow(response.user),
      source: 'api',
    }
  } catch (error) {
    return {
      data: null,
      source: 'unsupported',
      capabilityMessage: error instanceof Error ? error.message : "Impossible de mettre à jour l'utilisateur.",
    }
  }
}

export async function deleteAdminUser(
  id: string,
): Promise<AdminQueryResult<null>> {
  try {
    await apiFetch<{ message: string }>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    })
    return {
      data: null,
      source: 'api',
    }
  } catch (error) {
    return {
      data: null,
      source: 'unsupported',
      capabilityMessage: error instanceof Error ? error.message : "Impossible de supprimer l'utilisateur.",
    }
  }
}
