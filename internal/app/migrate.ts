import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { client, db } from '../db'
import { logger } from '../pkg/logger'

export const runMigrations = () => {
    try {
        migrate(db, { migrationsFolder: './drizzle' })
        logger.info('Database migrations completed')
    } finally {
        client.close()
    }
}
