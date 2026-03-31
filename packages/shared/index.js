export const USER_ROLES = ['buyer', 'seller', 'admin'];

export const ORDER_STATUSES = ['pending', 'confirmed', 'cancelled'];

const LEGACY_CONFIRMED_ORDER_STATUSES = new Set(['paid', 'shipped', 'delivered']);

export function normalizeOrderStatus(status) {
	if (ORDER_STATUSES.includes(status)) {
		return status;
	}

	if (status && LEGACY_CONFIRMED_ORDER_STATUSES.has(status)) {
		return 'confirmed';
	}

	return 'pending';
}
