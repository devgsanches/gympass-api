import type { Prisma, Gym } from 'generated/prisma'
import type {
  IFindByLocationParams,
  IGymRepository,
} from '../interfaces/gym-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymRepository implements IGymRepository {
  async create(data: Prisma.GymUncheckedCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })
    return gym
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    if (!gym) {
      return null
    }

    return gym
  }

  async findByQuery(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    if (!gyms) {
      return null
    }

    return gyms
  }

  async findByLocation(params: IFindByLocationParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * FROM gyms
        WHERE ( 6371 * acos( cos( radians(${params.latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${params.longitude}) ) + sin( radians(${params.latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    if (!gyms) {
      return null
    }

    return gyms
  }
}
