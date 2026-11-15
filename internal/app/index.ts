import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { openapi } from "@elysiajs/openapi";
import { authModule } from "../module/auth";
import { getAuthDocumentation } from "../module/auth/openapi";
import { helloModule } from "../module/hello";
import { dbMiddleware } from "../middleware/db";
import { contextMiddleware } from "../middleware/context";
import { responseMiddleware } from "../middleware/response";
import { failure } from "../pkg/response";
import { config } from '../config'
import { client } from '../db'
import { Logger } from '../pkg/logger'

const webDistPath = `${process.cwd()}/dist/web`;
const webIndexPath = `${webDistPath}/index.html`;

export const createApp = () =>
  new Elysia()
    .use(
      async () => new Elysia().use(openapi({
        // enabled: config.debug,
        path: "/swagger",
        provider: "swagger-ui",
        exclude: { paths: ["/*"] },
        documentation: {
          ...await getAuthDocumentation(),
          info: { title: "Fullstack Template API", version: "1.0.0" },
          tags: [
            { name: "Hello", description: "Greeting endpoints" },
            { name: "Auth", description: "Authentication and session endpoints" },
          ],
        },
      })),
    )
    .group("/api", (app) =>
      app
        .use(responseMiddleware)
        .use(contextMiddleware)
        .use(dbMiddleware)
        .use(authModule)
        .use(helloModule)
        .get("/*", ({ set }) => {
          set.status = 404;
          return failure(404, "API endpoint not found");
        }, { detail: { hide: true } })
        .all("/*", ({ set }) => {
          set.status = 404;
          return failure(404, "API endpoint not found");
        }, { detail: { hide: true } }),
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
