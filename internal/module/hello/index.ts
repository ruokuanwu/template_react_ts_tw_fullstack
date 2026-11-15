import { Elysia, t } from 'elysia'
import { contextMiddleware } from '../../middleware/context'
import { responseSchema, success } from '../../pkg/response'

const helloResponse = t.Object({
    timestamp: t.String({ format: 'date-time', description: 'Response time in UTC' }),
})

export const helloModule = new Elysia()
    .use(contextMiddleware)
    .get('/hello', ({ ctx }) => {
        ctx.logger.info('Handling hello request')

        return success({
            timestamp: new Date().toISOString(),
        }, 'Hello from Elysia!')
    }, {
        response: { 200: responseSchema(helloResponse) },
        detail: {
            tags: ['Hello'],
            summary: 'Get a greeting',
            description: 'Returns a greeting and the current server time.',
            operationId: 'getHello',
        },
    })
    .get('/hello/:name', ({ params: { name }, ctx }) => {
        ctx.logger.info({ name }, 'Handling named hello request')

        return success({
            timestamp: new Date().toISOString(),
        }, `Hello, ${name}!`)
    }, {
        params: t.Object({
            name: t.String({ description: 'Name to greet', examples: ['Alice'] }),
        }),
        response: { 200: responseSchema(helloResponse) },
        detail: {
            tags: ['Hello'],
            summary: 'Get a personalized greeting',
            description: 'Returns a greeting for the supplied name and the current server time.',
            operationId: 'getHelloByName',
        },
    })
