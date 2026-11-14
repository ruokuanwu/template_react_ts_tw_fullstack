import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { db } from './index'
import { logger } from '../pkg/logger'

migrate(db, { migrationsFolder: './drizzle' })
logger.info('Database migrations completed')
