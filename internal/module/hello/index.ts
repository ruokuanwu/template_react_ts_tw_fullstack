import { Elysia } from 'elysia'
import { contextMiddleware } from '../../middleware/context'

export const helloModule = new Elysia()
    .use(contextMiddleware)
    .get('/hello', ({ ctx }) => {
        ctx.logger.info('Handling hello request')

        return {
            message: 'Hello from Elysia!',
            timestamp: new Date().toISOString(),
        }
    })
    .get('/hello/:name', ({ params: { name }, ctx }) => {
        ctx.logger.info({ name }, 'Handling named hello request')

        return {
            message: `Hello, ${name}!`,
            timestamp: new Date().toISOString(),
        }
    })
