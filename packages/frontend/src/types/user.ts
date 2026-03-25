import type { UserRole } from '@greentrade/shared';

/**
 * Common shape for anything that can render a user identity in the UI.
 * It intentionally only contains public/display-safe fields.
 */
export interface UserDisplaySource {
  id: string;
  displayName?: string;
  avatar?: string;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  postalCode?: string | null;
  profile?: {
    avatar?: string;
    bio?: string;
  };
  location?: {
    city?: string;
    postalCode?: string;
    coordinates?: [number, number];
    distance?: number;
  };
}

/**
 * Public profile returned by the unauthenticated / public user endpoint.
 * It deliberately omits sensitive fields such as email and passwordHash.
 */
export interface PublicUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
  city?: string | null;
  postalCode?: string | null;
  profile?: {
    avatar?: string;
    bio?: string;
  };
  rating?: number;
  createdAt?: string;
  stats?: {
    activeProducts: number;
    completedSales: number;
  };
}

/**
 * Represents the authenticated user data as returned by the backend API.
 * It includes the private fields required by the signed-in account flows.
 */
export interface BackendUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  city?: string;
  postalCode?: string;
  profile?: {
    avatar?: string;
    phone?: string;
    address?: string;
    bio?: string;
  };
  location?: {
    city: string;
    postalCode: string;
    coordinates: [number, number];
    distance?: number;
  };
  rating: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Extracts the user's phone number from either the flat backend field
 * or the nested profile field.
 */
export function getUserPhone(user: BackendUser): string {
  return user.phone ?? user.profile?.phone ?? "";
}

/**
 * Extracts the user's city from either the flat backend field
 * or the nested mock location field.
 */
export function getUserCity(user: UserDisplaySource): string {
  return user.city ?? user.location?.city ?? "";
}

/**
 * Extracts the user's postal code from either the flat backend field
 * or the nested mock location field.
 */
export function getUserPostalCode(user: UserDisplaySource): string {
  return user.postalCode ?? user.location?.postalCode ?? "";
}

/**
 * Extracts the user's avatar URL from the root field or nested profile field.
 */
export function getUserAvatar(user: UserDisplaySource): string {
  return user.avatar ?? user.profile?.avatar ?? "";
}

/**
 * Returns the user's initials (first letter of firstName + first letter of lastName).
 */
export function getUserInitials(user: UserDisplaySource): string {
  const first = user.firstName?.charAt(0) ?? "";
  const last = user.lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Returns the user's full display name.
 */
export function getUserDisplayName(user: UserDisplaySource): string {
  const displayName = user.displayName?.trim();
  if (displayName) return displayName;

  return [user.firstName, user.lastName]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(' ')
    .trim();
}
