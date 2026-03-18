/**
 * Admin capability matrix — documents which backend endpoints exist.
 *
 * As of 2026-03-18:
 * - GET /api/users (admin) — list all users ✅
 * - GET /api/users/:id — public user profile ✅
 * - GET /api/admin/orders — all orders (admin) ✅
 * - GET /api/orders/:id — order detail ✅
 * - GET/POST/PUT/DELETE /api/products — full CRUD (admin role bypasses owner check) ✅
 * - PATCH/DELETE /api/users/:id for admin edits ❌
 */

export type AdminAction = 'list' | 'detail' | 'create' | 'update' | 'delete'

export type AdminCapabilityMatrix = Record<string, Record<AdminAction, boolean>>

export const ADMIN_CAPABILITIES: Record<'orders' | 'users' | 'products', Record<AdminAction, boolean>> = {
  orders: { list: true, detail: true, create: false, update: false, delete: false },
  users: { list: true, detail: true, create: false, update: false, delete: false },
  products: { list: true, detail: true, create: true, update: true, delete: true },
} as const

export type AdminDataSource = 'api' | 'mock' | 'unsupported'

export type AdminQueryResult<T> = {
  data: T
  source: AdminDataSource
  capabilityMessage?: string
}

export function getAdminCapabilityLabel(
  resource: keyof typeof ADMIN_CAPABILITIES,
  action: AdminAction,
): string {
  return ADMIN_CAPABILITIES[resource][action]
    ? 'Disponible'
    : "Action indisponible tant que l'endpoint backend correspondant n'existe pas."
}
