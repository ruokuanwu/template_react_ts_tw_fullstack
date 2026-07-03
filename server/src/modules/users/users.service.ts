import { usersRepository } from './users.repository'

export const usersService = {
    list: () => usersRepository.findAll(),
    get: (id: number) => usersRepository.findById(id),
    create: (user: { name: string; email: string }) => usersRepository.create(user),
    update: (id: number, user: { name?: string; email?: string }) =>
        usersRepository.update(id, user),
    delete: (id: number) => usersRepository.delete(id),
}
