import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: Bun.env.DATABASE_URL?.replace("file:", "") ?? "local.db",
  },
});
