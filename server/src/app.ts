import { Elysia } from 'elysia'
import { helloRoute } from './modules/hello/hello.routes'
import { usersRoute } from './modules/users/users.routes'
import { corsPlugin } from './plugins/cors'
import { dbPlugin } from './plugins/db'
import { loggerPlugin } from './plugins/logger'

export const createApp = () =>
    new Elysia()
        .use(corsPlugin)
        .use(loggerPlugin)
        .use(dbPlugin)
        .get('/', () => ({
            message: 'Welcome to Elysia API',
            version: '1.0.0',
            endpoints: {
                hello: '/api/hello',
                users: '/api/users',
            },
        }))
        .group('/api', (app) => app.use(helloRoute).use(usersRoute))

export type App = ReturnType<typeof createApp>
