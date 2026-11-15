export const config = {
  port: Number(Bun.env.PORT ?? 3000),
  debug: Bun.env.DEBUG === "true",
  logLevel: Bun.env.LOG_LEVEL ?? "info",
  baseUrl: Bun.env.BETTER_AUTH_URL ?? Bun.env.BASE_URL ?? "http://localhost:3000",
  clientUrl: Bun.env.CLIENT_URL ?? (Bun.env.NODE_ENV === "production" ? undefined : "http://localhost:5173"),
  databaseUrl: Bun.env.DATABASE_URL ?? "file:local.db",
};
