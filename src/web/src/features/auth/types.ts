import type { authClient } from './client'

export type AuthSession = typeof authClient.$Infer.Session
export type AuthUser = AuthSession['user']