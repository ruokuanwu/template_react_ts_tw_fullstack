export const config = {
  port: Number(Bun.env.PORT ?? 3000),
  debug: Bun.env.DEBUG === "true",
  logLevel: Bun.env.LOG_LEVEL ?? "info",
  baseUrl: Bun.env.BASE_URL ?? "http://localhost:3000",
  databaseUrl: Bun.env.DATABASE_URL ?? "file:local.db",
};
