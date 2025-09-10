import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { DeleteUserUseCase } from '../delete-user'

export function makeDeleteUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const deleteUser = new DeleteUserUseCase(usersRepository)

  return deleteUser
}
