import type { IUsersRepository } from '@/repositories/interfaces/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import type { ICheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import type { CheckIn } from 'generated/prisma'

interface IGetNumberTotalCheckInsByUserRequest {
  userId: string
}

type IGetNumberTotalCheckInsByUserResponse = number

export class GetNumberTotalCheckInsByUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private checkInsRepository: ICheckInsRepository
  ) {}

  async execute({
    userId,
  }: IGetNumberTotalCheckInsByUserRequest): Promise<IGetNumberTotalCheckInsByUserResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const checkInsCount =
      await this.checkInsRepository.findTotalCountCheckInsByUserId(userId)

    return checkInsCount
  }
}
