import { Elysia } from 'elysia'
import { logger } from '../lib/logger'

export const loggerPlugin = new Elysia({ name: 'logger' })
    .onRequest(({ request }) => {
        logger.info(`${request.method} ${new URL(request.url).pathname}`)
    })
    .onError(({ code, error }) => {
        logger.error(`Error ${code}: ${error}`)
    })
