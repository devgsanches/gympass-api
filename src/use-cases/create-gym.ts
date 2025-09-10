import type { Gym } from 'generated/prisma'
import type { IGymRepository } from '@/repositories/interfaces/gym-repository'

interface ICreateGym {
  title: string
  description?: string | null
  phone?: string | null
  latitude: number
  longitude: number
}

interface ICreateGymResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: IGymRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: ICreateGym): Promise<ICreateGymResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
