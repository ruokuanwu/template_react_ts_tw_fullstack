export const CONFIG = {
    port: Number(Bun.env.PORT ?? 3000),
    nodeEnv: Bun.env.NODE_ENV ?? 'development',
    databaseUrl: Bun.env.DATABASE_URL ?? 'file:local.db',
}
