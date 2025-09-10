import type { ICheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import type { CheckIn } from 'generated/prisma'
import type { IGymRepository } from '@/repositories/interfaces/gym-repository'
import type { IUsersRepository } from '@/repositories/interfaces/users-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ICheckInRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface ICheckInResponse {
  checkIn: CheckIn
}

export class CreateCheckInUseCase {
  constructor(
    private checkinsRepository: ICheckInsRepository,
    private usersRepository: IUsersRepository,
    private gymsRepository: IGymRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: ICheckInRequest): Promise<ICheckInResponse> {
    const user = await this.usersRepository.findById(userId)
    const gym = await this.gymsRepository.findById(gymId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // return in kilometers
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude, // user ll
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(), // gym ll
        longitude: gym.longitude.toNumber(),
      }
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkinsRepository.create({
      userId,
      gymId,
    })

    return {
      checkIn,
    }
  }
}
