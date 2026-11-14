export const config = {
  port: Number(Bun.env.PORT ?? 3000),
  nodeEnv: Bun.env.NODE_ENV ?? "development",
  baseUrl: Bun.env.BASE_URL ?? "http://localhost:3000",
  databaseUrl: Bun.env.DATABASE_URL ?? "file:local.db",
};
