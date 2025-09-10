import { prisma } from '@/lib/prisma'
import type { Prisma, User } from 'generated/prisma'
import type { IUsersRepository } from '../interfaces/users-repository'

export class PrismaUsersRepository implements IUsersRepository {
  async index(page: number) {
    const users = await prisma.user.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    return users
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async delete(id: string) {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    })

    return user
  }
}
