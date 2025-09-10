import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { PrismaCheckInsRepository } from '@/repositories/prisma/check-ins-repository'

import { GetTotalCheckInsByUserUseCase } from '../get-total-check-ins-by-user'

export function makeGetTotalCheckInsByUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const checkInsRepository = new PrismaCheckInsRepository()

  const getTotalCheckInsByUserUseCase = new GetTotalCheckInsByUserUseCase(
    usersRepository,
    checkInsRepository
  )

  return getTotalCheckInsByUserUseCase
}
