import type { IUsersRepository } from '@/repositories/interfaces/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import type { ICheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import type { CheckIn } from 'generated/prisma'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface IGetTotalCheckInsByUserRequest {
  userId: string
  page: number
}

interface IGetTotalCheckInsByUserResponse {
  checkIns: CheckIn[]
}

export class GetTotalCheckInsByUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private checkInsRepository: ICheckInsRepository
  ) {}

  async execute({
    userId,
    page,
  }: IGetTotalCheckInsByUserRequest): Promise<IGetTotalCheckInsByUserResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError(`User with id ${userId} not found.`)
    }

    const checkIns = await this.checkInsRepository.findManyCheckInsByUserId(
      userId,
      page
    )

    if (!checkIns) {
      throw new ResourceNotFoundError(
        `Check-ins with user id ${userId} not found.`
      )
    }

    return {
      checkIns,
    }
  }
}
