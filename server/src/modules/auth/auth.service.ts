import { betterAuth } from 'better-auth'
import { CONFIG } from '../../config/config'
import { authRepository } from './auth.repository'

export const authService = betterAuth({
    appName: 'Fullstack Template',
    baseURL: CONFIG.authUrl,
    secret: CONFIG.authSecret,
    trustedOrigins: [CONFIG.clientUrl],
    database: authRepository,
    emailAndPassword: {
        enabled: true,
    },
})