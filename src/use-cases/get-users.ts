import type { User } from 'generated/prisma'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import type { IUsersRepository } from '@/repositories/interfaces/users-repository'

interface IGetUsersRequest {
  page?: number
}

interface IGetUsersResponse {
  users: User[]
}

export class GetUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ page }: IGetUsersRequest): Promise<IGetUsersResponse> {
    const users = await this.usersRepository.index(page ? page : 1)

    if (!users || users.length === 0) {
      throw new ResourceNotFoundError('Users not found.')
    }

    return {
      users,
    }
  }
}
