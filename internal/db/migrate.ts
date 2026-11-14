import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { db } from './index'
import { logger } from '../pkg/logger'

export const runMigrations = () => {
    migrate(db, { migrationsFolder: './drizzle' })
    logger.info('Database migrations completed')
}
