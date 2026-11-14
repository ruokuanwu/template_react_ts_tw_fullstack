import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { client, db } from '../db'
import { Logger } from '../pkg/logger'

export const runMigrations = () => {
    try {
        migrate(db, { migrationsFolder: './drizzle' })
        Logger.info('Database migrations completed')
    } finally {
        client.close()
    }
}
