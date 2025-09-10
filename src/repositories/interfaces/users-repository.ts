import type { Prisma, User } from 'generated/prisma'

export interface IUsersRepository {
  index(page: number): Promise<User[] | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  delete(id: string): Promise<User>
}
