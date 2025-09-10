import { prisma } from '@/lib/prisma'
import type { CheckIn, Prisma } from 'generated/prisma'
import type { ICheckInsRepository } from '../interfaces/check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkin = await prisma.checkIn.create({
      data,
    })

    return checkin
  }

  async findTotalCountCheckInsByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        userId,
      },
    })

    return count
  }

  async findManyCheckInsByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    if (!checkIns) {
      return null
    }

    return checkIns
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async validate(id: string) {
    const checkInValidated = await prisma.checkIn.update({
      where: {
        id,
      },
      data: {
        validatedAt: new Date(),
      },
    })

    return checkInValidated
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('day')
    const endOfTheDay = dayjs(date).endOf('day')

    const checkInOnSameDate = await prisma.checkIn.findFirst({
      where: {
        userId,
        createdAt: {
          //                        dates example:
          gte: startOfTheDay.toDate(), // >= "2024-01-15 00:00:00.000"
          lte: endOfTheDay.toDate(), // <= "2024-01-15 23:59:59.999"
        },
      },
    })

    return checkInOnSameDate
  }
}
