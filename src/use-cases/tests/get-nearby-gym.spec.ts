import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { GetNearbyGymsUseCase } from '../get-nearby-gym'
import { NoGymsNearbyError } from '../errors/no-gyms-nearby-error'

describe('Get Nearby Gyms Use Case', () => {
  let gymsRepository: InMemoryGymRepository
  let sut: GetNearbyGymsUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new GetNearbyGymsUseCase(gymsRepository)
  })

  it('should be possible to list gyms near the user', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: 'Programming Academy',
        latitude: -23.4081329,
        longitude: -46.3254991,
      })
    } // all gyms in 9km from user

    const { gyms } = await sut.execute({
      latitude: -23.4892139,
      longitude: -46.3254991,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ id: 'gym-21' }),
      expect.objectContaining({ id: 'gym-22' }),
    ])
  })

  it('should not return any nearby gym, distance limit reached', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: 'Programming Academy',
        latitude: -23.3901149,
        longitude: -46.3254991,
      })
    }

    await expect(() =>
      sut.execute({
        latitude: -23.4887624,
        longitude: -46.3323503,
        page: 1,
      })
    ).rejects.toBeInstanceOf(NoGymsNearbyError)
  })
})
