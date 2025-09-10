import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { PrismaCheckInsRepository } from '@/repositories/prisma/check-ins-repository'
import { PrismaGymRepository } from '@/repositories/prisma/gym-repository'

import { CreateCheckInUseCase } from '../create-check-in'

export function makeCreateCheckInUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymRepository()

  const checkInUseCase = new CreateCheckInUseCase(
    checkInsRepository,
    usersRepository,
    gymsRepository
  )

  return checkInUseCase
}
