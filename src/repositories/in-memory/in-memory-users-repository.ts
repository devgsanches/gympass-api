import type { Prisma, User } from 'generated/prisma'
import type { IUsersRepository } from '../interfaces/users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = []

  async index(page: number) {
    const users = this.items.slice((page - 1) * 20, page * 20)

    if (!users) {
      return null
    }

    return users
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(user)

    return user
  }
  async findByEmail(email: string) {
    const user = this.items.find(user => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.items.find(user => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async delete(id: string) {
    this.items = this.items.filter(user => user.id !== id)

    return this.items[0]
  }
}
