import { Elysia } from 'elysia'
import { authService } from './auth.service'

export const authModule = new Elysia({ name: 'auth-module' }).mount(
    authService.handler,
)