import { createApp } from './app'
import { env } from './config/env'
import { logger } from './lib/logger'

const app = createApp().listen(env.port)

logger.info(
  `Elysia server is running at ${app.server?.hostname}:${app.server?.port}`,
)

export type App = typeof app
