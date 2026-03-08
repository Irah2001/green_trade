/**
 * Represents the authenticated user data as returned by the backend API.
 * This extends the base mock User interface by including the flat fields
 * that the Prisma backend returns (phone, city, postalCode at root level).
 */
export interface BackendUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin" | "producer"
  phone?: string
  city?: string
  postalCode?: string
  createdAt: string
  updatedAt?: string
  /** Legacy mock fields — used by mock data only */
  profile?: {
    avatar?: string
    phone?: string
    address?: string
    bio?: string
  }
  location?: {
    city: string
    postalCode: string
    coordinates: [number, number]
  }
  rating?: number
}

/**
 * Extracts the user's phone number from either the flat backend field
 * or the nested mock profile field.
 */
export function getUserPhone(user: BackendUser): string {
  return user.phone ?? user.profile?.phone ?? ""
}

/**
 * Extracts the user's city from either the flat backend field
 * or the nested mock location field.
 */
export function getUserCity(user: BackendUser): string {
  return user.city ?? user.location?.city ?? ""
}

/**
 * Extracts the user's postal code from either the flat backend field
 * or the nested mock location field.
 */
export function getUserPostalCode(user: BackendUser): string {
  return user.postalCode ?? user.location?.postalCode ?? ""
}

/**
 * Extracts the user's avatar URL from the nested profile field.
 */
export function getUserAvatar(user: BackendUser): string {
  return user.profile?.avatar ?? ""
}

/**
 * Returns the user's initials (first letter of firstName + first letter of lastName).
 */
export function getUserInitials(user: BackendUser): string {
  const first = user.firstName?.charAt(0) ?? ""
  const last = user.lastName?.charAt(0) ?? ""
  return `${first}${last}`.toUpperCase()
}

/**
 * Returns the user's full display name.
 */
export function getUserDisplayName(user: BackendUser): string {
  return `${user.firstName} ${user.lastName}`.trim()
}
