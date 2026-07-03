import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'

type NewUser = typeof users.$inferInsert

type UserUpdate = Partial<Pick<NewUser, 'name' | 'email'>>

export const usersRepository = {
    findAll: () => db.select().from(users).all(),
    findById: (id: number) => db.select().from(users).where(eq(users.id, id)).get(),
    create: (user: NewUser) => db.insert(users).values(user).returning().get(),
    update: (id: number, user: UserUpdate) =>
        db.update(users).set(user).where(eq(users.id, id)).returning().get(),
    delete: (id: number) =>
        db.delete(users).where(eq(users.id, id)).returning().get(),
}
