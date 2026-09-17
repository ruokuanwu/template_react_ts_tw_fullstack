import { Elysia } from 'elysia'
import { logger } from '../lib/logger'
import { requestIdPlugin } from './request-id'

export const loggerPlugin = new Elysia({ name: 'logger' })
    .use(requestIdPlugin)
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
