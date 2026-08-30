import { Elysia } from "elysia";
import { authModule } from "./modules/auth";
import { helloRoute } from "./modules/hello/hello.routes";
import { corsPlugin } from "./plugins/cors";
import { dbPlugin } from "./plugins/db";
import { loggerPlugin } from "./plugins/logger";

export const createApp = () =>
  new Elysia()
    .use(corsPlugin)
    .use(loggerPlugin)
    .use(dbPlugin)
    .use(authModule)
    .get("/", () => ({
      message: "Welcome to Elysia API",
      version: "1.0.0",
      endpoints: {
        hello: "/api/hello",
        auth: "/api/auth",
      },
    }))
    .group("/api", (app) => app.use(helloRoute));

export type App = ReturnType<typeof createApp>;
