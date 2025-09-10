import { Prisma, type Gym } from 'generated/prisma'
import type {
  IFindByLocationParams,
  IGymRepository,
} from '../interfaces/gym-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymRepository implements IGymRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymUncheckedCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.items.find(gym => gym.id === gymId)

    if (!gym) {
      return null
    }

    return gym
  }

  async findByQuery(query: string, page: number): Promise<Gym[] | null> {
    const gyms = this.items
      .filter(gym => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)

    if (!gyms) {
      return null
    }

    return gyms
  }

  async findByLocation(params: IFindByLocationParams): Promise<Gym[] | null> {
    return this.items
      .filter(gym => {
        const distance = getDistanceBetweenCoordinates(
          {
            latitude: params.latitude, // ll user
            longitude: params.longitude,
          },
          {
            latitude: gym.latitude.toNumber(),
            longitude: gym.longitude.toNumber(),
          }
        )

        const MAX_DISTANCE_IN_KILOMETERS = 10

        return distance <= MAX_DISTANCE_IN_KILOMETERS
      })
      .slice((params.page - 1) * 20, params.page * 20)
  }
}
