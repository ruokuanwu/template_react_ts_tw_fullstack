import { Elysia } from 'elysia'
import type { RequestContext } from '../../pkg/request-context'
import { loggerMiddleware } from '../../middleware/logger'

export const helloModule = new Elysia()
    .use(loggerMiddleware)
    .get('/hello', ({ reqLogger }) => {
        const context: RequestContext = { logger: reqLogger }
        context.logger.info('Handling hello request')

        return {
            message: 'Hello from Elysia!',
            timestamp: new Date().toISOString(),
        }
    })
    .get('/hello/:name', ({ params: { name }, reqLogger }) => {
        const context: RequestContext = { logger: reqLogger }
        context.logger.info({ name }, 'Handling named hello request')

        return {
            message: `Hello, ${name}!`,
            timestamp: new Date().toISOString(),
        }
    })
