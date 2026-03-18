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
