export declare const USER_ROLES: readonly ['buyer', 'seller', 'admin'];
export type UserRole = (typeof USER_ROLES)[number];

export declare const ORDER_STATUSES: readonly ['pending', 'confirmed', 'cancelled'];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export declare function normalizeOrderStatus(status: string | null | undefined): OrderStatus;
