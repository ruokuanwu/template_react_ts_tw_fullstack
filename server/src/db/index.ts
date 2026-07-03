import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import { env } from '../config/env'
import * as schema from './schema'

const sqlite = new Database(env.databaseUrl.replace('file:', ''))

export const db = drizzle(sqlite, { schema })
