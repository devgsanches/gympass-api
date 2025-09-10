import type { Gym, Prisma } from 'generated/prisma'

export interface IFindByLocationParams {
  latitude: number
  longitude: number
  page: number
}

export interface IGymRepository {
  create(data: Prisma.GymUncheckedCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  findByQuery(query: string, page: number): Promise<Gym[] | null>
  findByLocation(params: IFindByLocationParams): Promise<Gym[] | null>
}
