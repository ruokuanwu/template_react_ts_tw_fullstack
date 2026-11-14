import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { authModule } from "../module/auth";
import { helloModule } from "../module/hello";
import { dbMiddleware } from "../middleware/db";
import { contextMiddleware } from "../middleware/context";
import { config } from '../config'
import { client } from '../db'
import { Logger } from '../pkg/logger'

const webDistPath = `${process.cwd()}/dist/web`;
const webIndexPath = `${webDistPath}/index.html`;

export const createApp = () =>
  new Elysia()
    .group("/api", (app) =>
      app
        .use(contextMiddleware)
        .use(dbMiddleware)
        .use(authModule)
        .use(helloModule),
    )
    .use(
      staticPlugin({
        assets: webDistPath,
        prefix: "/",
        alwaysStatic: true,
      }),
    )
    .get("/*", () => Bun.file(webIndexPath));

export type App = ReturnType<typeof createApp>;

export const runApp = () => {
  const app = createApp().listen(config.port)
  let stopping = false

  const stop = async () => {
    if (stopping) return
    stopping = true
    process.off('SIGINT', onSignal)
    process.off('SIGTERM', onSignal)

    try {
      await app.stop()
      Logger.info('Elysia server stopped')
    } finally {
      client.close()
    }
  }

  const onSignal = () => {
    void stop().catch((error: unknown) => {
      Logger.error({ err: error }, 'Failed to stop application')
      process.exitCode = 1
    })
  }

  process.once('SIGINT', onSignal)
  process.once('SIGTERM', onSignal)
  Logger.info(`Elysia server is running at ${app.server?.hostname}:${app.server?.port}`)

  return { app, stop }
}
