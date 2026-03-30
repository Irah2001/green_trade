export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

const LEGACY_CONFIRMED_STATUSES = new Set(['paid', 'shipped', 'delivered']);

export function normalizeOrderStatus(status: string | null | undefined): OrderStatus {
  if (status === 'pending' || status === 'confirmed' || status === 'cancelled') {
    return status;
  }

  if (status && LEGACY_CONFIRMED_STATUSES.has(status)) {
    return 'confirmed';
  }

  return 'pending';
}
