import { createApp } from "./app";
import { config } from "./config";
import { logger } from "./lib/logger";

const app = createApp().listen(config.port);

logger.info(
  `Elysia server is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
