import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CreateCheckInUseCase } from '../create-check-in'

import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { Decimal } from 'generated/prisma/runtime/library'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '../errors/max-distance-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

describe('Checkin Use Case', () => {
  let userRepository: InMemoryUsersRepository
  let checkinsRepository: InMemoryCheckInsRepository
  let gymRepository: InMemoryGymRepository
  let sut: CreateCheckInUseCase

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    checkinsRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymRepository()

    await userRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await gymRepository.create({
      id: 'gym-01',
      title: 'Gym 01',
      latitude: -23.5504404,
      longitude: -46.4519168,
    })

    sut = new CreateCheckInUseCase(
      checkinsRepository,
      userRepository,
      gymRepository
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to checkin', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5504404,
      userLongitude: -46.4519168,
    })

    expect(checkIn.gymId).toEqual('gym-01')
  })

  it('should not be able to checkin with gymId that does not exist', async () => {
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.5504404,
        userLongitude: -46.4519168,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to checkin with userId that does not exist', async () => {
    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-02',
        userLatitude: -23.5504404,
        userLongitude: -46.4519168,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able two checkins in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5504404,
      userLongitude: -46.4519168,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.5504404,
        userLongitude: -46.4519168,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should check in on different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0)) // ano, mes, dia, hora, minuto e segundo

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5504404,
      userLongitude: -46.4519168,
    })

    vi.setSystemTime(new Date(2022, 2, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5504404,
      userLongitude: -46.4519168,
    })

    expect(checkIn.gymId).toEqual('gym-01')
  })

  it('should not be able to check in on a distant gym', async () => {
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5504404,
      userLongitude: -46.4519168,
    })

    await gymRepository.create({
      id: 'gym-02',
      title: 'Gym 02',
      latitude: -23.4892139,
      longitude: -46.3254991,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.5504404,
        userLongitude: -46.4519168,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
