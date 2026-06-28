import { Elysia, t } from 'elysia'

interface User {
  id: number
  name: string
  email: string
}

// Mock database
let users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
]

let nextId = 4

export const usersRoute = new Elysia()
  // Get all users
  .get('/users', () => ({
    success: true,
    data: users,
    count: users.length,
  }))

  // Get user by ID
  .get(
    '/users/:id',
    ({ params: { id }, error }) => {
      const user = users.find((u) => u.id === parseInt(id))
      if (!user) {
        return error(404, { success: false, message: 'User not found' })
      }
      return { success: true, data: user }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Create user
  .post(
    '/users',
    ({ body }) => {
      const newUser: User = {
        id: nextId++,
        name: body.name,
        email: body.email,
      }
      users.push(newUser)
      return {
        success: true,
        message: 'User created successfully',
        data: newUser,
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: 'email' }),
      }),
    }
  )

  // Update user
  .put(
    '/users/:id',
    ({ params: { id }, body, error }) => {
      const userIndex = users.findIndex((u) => u.id === parseInt(id))
      if (userIndex === -1) {
        return error(404, { success: false, message: 'User not found' })
      }
      users[userIndex] = { ...users[userIndex], ...body }
      return {
        success: true,
        message: 'User updated successfully',
        data: users[userIndex],
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Partial(
        t.Object({
          name: t.String(),
          email: t.String({ format: 'email' }),
        })
      ),
    }
  )

  // Delete user
  .delete(
    '/users/:id',
    ({ params: { id }, error }) => {
      const userIndex = users.findIndex((u) => u.id === parseInt(id))
      if (userIndex === -1) {
        return error(404, { success: false, message: 'User not found' })
      }
      const deletedUser = users.splice(userIndex, 1)[0]
      return {
        success: true,
        message: 'User deleted successfully',
        data: deletedUser,
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
