import { apiFetch } from '@/services/api'
import type { PublicUser } from '@/types/user'

export async function getPublicUserById(id: string): Promise<PublicUser> {
  return apiFetch<PublicUser>(`/api/users/${id}`)
}

export async function getPublicUsersByIds(ids: string[]): Promise<Record<string, PublicUser>> {
  const uniqueIds = Array.from(new Set(ids));
  const promises = uniqueIds.map((id) => getPublicUserById(id));
  const users = await Promise.all(promises);
  return Object.fromEntries(users.map((user) => [user.id, user]));
}
