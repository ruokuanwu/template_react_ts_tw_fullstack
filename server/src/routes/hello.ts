import { Elysia } from 'elysia'

export const helloRoute = new Elysia()
  .get('/hello', () => ({
    message: 'Hello from Elysia!',
    timestamp: new Date().toISOString(),
  }))
  .get('/hello/:name', ({ params: { name } }) => ({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  }))
