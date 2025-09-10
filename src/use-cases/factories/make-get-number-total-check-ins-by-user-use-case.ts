import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { PrismaCheckInsRepository } from '@/repositories/prisma/check-ins-repository'

import { GetNumberTotalCheckInsByUserUseCase } from '../get-number-total-check-ins-by-user'

export function makeGetNumberTotalCheckInsByUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const checkInsRepository = new PrismaCheckInsRepository()

  const getNumberTotalCheckInsByUserUseCase = new GetNumberTotalCheckInsByUserUseCase(
    usersRepository,
    checkInsRepository
  )

  return getNumberTotalCheckInsByUserUseCase
}
