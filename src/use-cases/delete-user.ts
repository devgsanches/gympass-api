import type { IUsersRepository } from '@/repositories/interfaces/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import type { User } from 'generated/prisma'

interface IDeleteUserRequest {
  id: string
}

interface IDeleteUserResponse {
  user: User
}

export class DeleteUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ id }: IDeleteUserRequest): Promise<IDeleteUserResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    const deletedUser = await this.usersRepository.delete(id)

    return {
      user: deletedUser,
    }
  }
}
