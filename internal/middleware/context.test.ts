import { describe, expect, test } from 'bun:test'
import { Elysia } from 'elysia'
import { contextMiddleware } from './context'
import { helloModule } from '../module/hello'
import type { Context } from '../pkg/context'

describe('contextMiddleware', () => {
    test('isolates contexts and loggers across concurrent requests', async () => {
        const contexts: Context[] = []
        const readRequestId = async (ctx: Context) => {
            contexts.push(ctx)
            await Bun.sleep(1)
            return ctx.logger.bindings().requestId
        }
        const app = new Elysia()
            .use(contextMiddleware)
            .get('/context', async ({ ctx, logger: reqLogger }) => ({
                requestId: await readRequestId(ctx),
                sameLogger: ctx.logger === reqLogger,
            }))

        const responses = await Promise.all(
            ['first', 'second'].map(async (requestId) => {
                const response = await app.handle(new Request('http://localhost/context', {
                    headers: { 'x-request-id': requestId },
                }))
                expect(response.status).toBe(200)
                return response.json()
            }),
        )

        expect(responses).toEqual([
            { requestId: 'first', sameLogger: true },
            { requestId: 'second', sameLogger: true },
        ])
        expect(contexts[0]).not.toBe(contexts[1])
        expect(contexts[0].logger).not.toBe(contexts[1].logger)
    })

    test('generates a request ID when none is supplied', async () => {
        const app = new Elysia()
            .use(contextMiddleware)
            .get('/context', ({ ctx }) => ctx.logger.bindings())
        const response = await app.handle(new Request('http://localhost/context'))
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body).toEqual({
            requestId: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        })
    })

    test('preserves hello responses when composed inside an API group', async () => {
        const app = new Elysia().group('/api', (api) => api
            .use(contextMiddleware)
            .use(helloModule))

        for (const [path, message] of [
            ['/api/hello', 'Hello from Elysia!'],
            ['/api/hello/Alice', 'Hello, Alice!'],
        ]) {
            const response = await app.handle(new Request(`http://localhost${path}`))
            const body = await response.json()

            expect(response.status).toBe(200)
            expect(body).toEqual({
                message,
                timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
            })
        }
    })
})
