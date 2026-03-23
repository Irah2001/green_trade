import { apiFetch } from '@/services/api'
import type { BackendUser } from '@/types/user'

export async function getPublicUserById(id: string): Promise<BackendUser> {
  return apiFetch<BackendUser>(`/api/users/${id}`)
}

export async function getPublicUsersByIds(ids: string[]): Promise<Record<string, BackendUser>> {
  const uniqueIds = Array.from(new Set(ids));
  const promises = uniqueIds.map(id => getPublicUserById(id));
  const users = await Promise.all(promises);
  return Object.fromEntries(users.map(user => [user.id, user]));
}
