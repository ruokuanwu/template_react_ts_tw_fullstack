import type { authService } from '../auth.service'

export type AuthSessionDto = typeof authService.$Infer.Session
export type AuthUserDto = AuthSessionDto['user']