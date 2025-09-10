import type { CheckIn, Prisma } from 'generated/prisma'

export interface ICheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findTotalCountCheckInsByUserId(userId: string): Promise<number>
  findManyCheckInsByUserId(
    userId: string,
    page: number
  ): Promise<CheckIn[] | null>
  findById(id: string): Promise<CheckIn | null>
  validate(id: string): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
