export const config = {
  port: Number(Bun.env.PORT ?? 3000),
  nodeEnv: Bun.env.NODE_ENV ?? "development",
  databaseUrl: Bun.env.DATABASE_URL ?? "file:local.db",
  authUrl: Bun.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  authSecret:
    Bun.env.BETTER_AUTH_SECRET ?? "development-only-secret-change-me-now",
  clientUrl: Bun.env.CLIENT_URL ?? "http://localhost:5173",
};
