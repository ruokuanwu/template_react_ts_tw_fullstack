import { t } from 'elysia'

export const userIdParamsSchema = t.Object({
    id: t.Numeric(),
})

export const createUserBodySchema = t.Object({
    name: t.String(),
    email: t.String({ format: 'email' }),
})

export const updateUserBodySchema = t.Partial(createUserBodySchema)
