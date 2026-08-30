import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { db } from './index'
import { logger } from '../lib/logger'

migrate(db, { migrationsFolder: './migrations' })
logger.info('Database migrations completed')
