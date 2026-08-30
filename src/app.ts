import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { authModule } from "./modules/auth";
import { helloRoute } from "./modules/hello/hello.routes";
import { corsPlugin } from "./plugins/cors";
import { dbPlugin } from "./plugins/db";
import { loggerPlugin } from "./plugins/logger";

const webDistPath = `${process.cwd()}/dist/web`;
const webIndexPath = `${webDistPath}/index.html`;

export const createApp = () =>
  new Elysia()
    .use(corsPlugin)
    .use(loggerPlugin)
    .use(dbPlugin)
    .use(authModule)
    .group("/api", (app) =>
      app
        .get("/", () => ({
          message: "Welcome to Elysia API",
          version: "1.0.0",
          endpoints: {
            hello: "/api/hello",
            auth: "/api/auth",
          },
        }))
        .use(helloRoute),
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
