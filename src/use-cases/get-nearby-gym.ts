import type { Gym } from 'generated/prisma'
import type { IGymRepository } from '@/repositories/interfaces/gym-repository'
import { NoGymsNearbyError } from './errors/no-gyms-nearby-error'

interface IGetNearbyGymsRequest {
  latitude: number
  longitude: number
  page: number
}

interface IGetNearbyGymsResponse {
  gyms: Gym[]
}

export class GetNearbyGymsUseCase {
  constructor(private gymsRepository: IGymRepository) {}

  async execute({
    latitude,
    longitude,
    page,
  }: IGetNearbyGymsRequest): Promise<IGetNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findByLocation({
      latitude,
      longitude,
      page,
    })

    if (!gyms || gyms.length === 0) {
      throw new NoGymsNearbyError()
    }

    return {
      gyms,
    }
  }
}
