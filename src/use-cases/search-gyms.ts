import type { Gym } from 'generated/prisma'
import type { IGymRepository } from '@/repositories/interfaces/gym-repository'
import { GymNotFoundError } from './errors/gym-not-found-error'

interface ISearchGymsRequest {
  query: string
  page: number
}

interface ISearchGymsResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: IGymRepository) {}

  async execute({
    query,
    page,
  }: ISearchGymsRequest): Promise<ISearchGymsResponse> {
    const gyms = await this.gymsRepository.findByQuery(query, page)

    if (!gyms) {
      throw new GymNotFoundError()
    }

    return {
      gyms,
    }
  }
}
