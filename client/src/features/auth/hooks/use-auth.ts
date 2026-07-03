import type { AuthUser } from '../types'

export function useAuth() {
  const user: AuthUser | null = null

  return {
    user,
    isAuthenticated: Boolean(user),
  }
}
