import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { helloRoute } from './routes/hello'
import { usersRoute } from './routes/users'

const app = new Elysia()
  .use(cors())
  .get('/', () => ({
    message: 'Welcome to Elysia API',
    version: '1.0.0',
    endpoints: {
      hello: '/api/hello',
      users: '/api/users',
    },
  }))
  .group('/api', (app) =>
    app
      .use(helloRoute)
      .use(usersRoute)
  )
  .listen(3000)

console.log(
  `🦊 Elysia server is running at ${app.server?.hostname}:${app.server?.port}`
)

export type App = typeof app
