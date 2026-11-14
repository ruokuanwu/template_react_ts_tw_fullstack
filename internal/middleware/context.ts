import { Elysia } from 'elysia'
import { loggerMiddleware } from './logger'
import type { Context } from '../pkg/context'

export const contextMiddleware = new Elysia({ name: 'request-context' })
    .use(loggerMiddleware)
    .derive(({ logger: reqLogger }) => ({
        ctx: { logger: reqLogger } satisfies Context,
    }))
    .as('global')
