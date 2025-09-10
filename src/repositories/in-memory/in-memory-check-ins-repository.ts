import type { CheckIn, Prisma } from 'generated/prisma'
import type { ICheckInsRepository } from '../interfaces/check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkin = {
      id: randomUUID(),
      userId: data.userId,
      gymId: data.gymId,
      createdAt: new Date(),
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
    }

    this.items.push(checkin)

    return checkin
  }

  async findTotalCountCheckInsByUserId(userId: string) {
    return this.items.filter(checkIn => checkIn.userId === userId).length
  }

  async findManyCheckInsByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter(checkIn => checkIn.userId === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('day')
    const endOfTheDay = dayjs(date).endOf('day')

    const checkInOnSameDate = this.items.find(checkIn => {
      const checkInDate = dayjs(checkIn.createdAt)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.userId === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findById(id: string) {
    const checkIn = this.items.find(checkIn => checkIn.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async validate(id: string) {
    const checkInIndex = this.items.findIndex(checkIn => checkIn.id === id)

    this.items[checkInIndex] = {
      ...this.items[checkInIndex],
      validatedAt: new Date(),
    }

    return this.items[checkInIndex]
  }
}
