import { Elysia } from 'elysia'
import { loggerMiddleware } from './logger'
import type { RequestContext } from '../pkg/request-context'

export const contextMiddleware = new Elysia({ name: 'request-context' })
    .use(loggerMiddleware)
    .derive(({ reqLogger }) => ({
        ctx: { logger: reqLogger } satisfies RequestContext,
    }))
    .as('global')
