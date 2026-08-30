import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from '../../db'
import * as schema from '../../db/schema'

export const authRepository = drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
})