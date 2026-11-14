import { Elysia } from 'elysia'
import { logger } from '../pkg/logger'
import { requestIdMiddleware } from './request-id'

export const loggerMiddleware = new Elysia({ name: 'logger' })
    .use(requestIdMiddleware)
    .derive(({ requestId }) => ({
        reqLogger: logger.child({ requestId }),
    }))
    .onBeforeHandle(({ request, reqLogger }) => {
        reqLogger.info(`${request.method} ${new URL(request.url).pathname}`)
    })
    .onError(({ code, error, reqLogger }) => {
        const errorLogger = reqLogger ?? logger
        errorLogger.error(`Error ${code}: ${error}`)
    })
    .as('global')
