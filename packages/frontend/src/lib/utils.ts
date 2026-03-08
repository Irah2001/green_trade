import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a readable string from TanStack Standard Schema validation errors
 * without using TypeScript 'any'.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message)
  }
  return String(error)
}
