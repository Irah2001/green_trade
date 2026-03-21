const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

function getBrowserCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`))

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

async function getAuthToken(): Promise<string | null> {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('gt_token') ?? getBrowserCookie('gt_token')
  }

  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    return cookieStore.get('gt_token')?.value ?? null
  } catch {
    return null
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAuthToken()
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Erreur API')
  }
  return response.json() as Promise<T>
}
