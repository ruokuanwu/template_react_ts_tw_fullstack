import { Elysia } from 'elysia'
import { Logger } from '../pkg/logger'
import { requestIdMiddleware } from './request-id'

export const loggerMiddleware = new Elysia({ name: 'logger' })
    .use(requestIdMiddleware)
    .derive(({ requestId }) => ({
        logger: Logger.child({ requestId }),
    }))
    .onBeforeHandle(({ request, logger }) => {
        logger.info(`${request.method} ${new URL(request.url).pathname}`)
    })
    .onError(({ code, error, logger }) => {
        if (logger) {
            logger.error(`Error ${code}: ${error}`)
        } else {
            Logger.error(`Error ${code}: ${error}`)
        }
    })
    .as('global')
