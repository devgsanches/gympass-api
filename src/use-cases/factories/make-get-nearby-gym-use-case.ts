import { PrismaGymRepository } from '@/repositories/prisma/gym-repository'

import { GetNearbyGymsUseCase } from '../get-nearby-gym'

export function makeGetNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymRepository()

  const getNearbyGymsUseCase = new GetNearbyGymsUseCase(gymsRepository)

  return getNearbyGymsUseCase
}
