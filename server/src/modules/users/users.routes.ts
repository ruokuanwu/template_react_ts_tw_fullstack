import { Elysia } from 'elysia'
import { usersService } from './users.service'
import {
    createUserBodySchema,
    updateUserBodySchema,
    userIdParamsSchema,
} from './users.schema'

export const usersRoute = new Elysia()
    .get('/users', () => {
        const data = usersService.list()
        return {
            success: true,
            data,
            count: data.length,
        }
    })
    .get(
        '/users/:id',
        ({ params: { id }, set }) => {
            const user = usersService.get(id)
            if (!user) {
                set.status = 404
                return { success: false, message: 'User not found' }
            }
            return { success: true, data: user }
        },
        { params: userIdParamsSchema },
    )
    .post(
        '/users',
        ({ body }) => ({
            success: true,
            message: 'User created successfully',
            data: usersService.create(body),
        }),
        { body: createUserBodySchema },
    )
    .put(
        '/users/:id',
        ({ params: { id }, body, set }) => {
            const user = usersService.update(id, body)
            if (!user) {
                set.status = 404
                return { success: false, message: 'User not found' }
            }
            return {
                success: true,
                message: 'User updated successfully',
                data: user,
            }
        },
        {
            params: userIdParamsSchema,
            body: updateUserBodySchema,
        },
    )
    .delete(
        '/users/:id',
        ({ params: { id }, set }) => {
            const user = usersService.delete(id)
            if (!user) {
                set.status = 404
                return { success: false, message: 'User not found' }
            }
            return {
                success: true,
                message: 'User deleted successfully',
                data: user,
            }
        },
        { params: userIdParamsSchema },
    )
