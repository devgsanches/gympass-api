import type { IUsersRepository } from '@/repositories/interfaces/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import type { User } from 'generated/prisma'

interface IGetUserProfileRequest {
  id: string
}

interface IGetUserProfileResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ id }: IGetUserProfileRequest): Promise<IGetUserProfileResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return {
      user,
    }
  }
}
