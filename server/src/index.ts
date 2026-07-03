import { createApp } from './app'
import { CONFIG } from './config/config'
import { logger } from './lib/logger'

const app = createApp().listen(CONFIG.port)

logger.info(
  `Elysia server is running at ${app.server?.hostname}:${app.server?.port}`,
)

export type App = typeof app
