import { Elysia } from 'elysia'
import type { RequestContext } from '../../lib/request-context'
import { loggerPlugin } from '../../plugins/logger'

export const helloRoute = new Elysia()
    .use(loggerPlugin)
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
