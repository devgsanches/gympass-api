import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { SearchGymsUseCase } from '../search-gyms'

describe('Creater User Use Case', () => {
  let gymsRepository: InMemoryGymRepository
  let sut: SearchGymsUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be possible for the user to search for gyms by name', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: 'Programming Academy',
        latitude: -23.4892139,
        longitude: -46.3254991,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Programming Academy',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        id: 'gym-21',
        title: 'Programming Academy',
      }),
      expect.objectContaining({
        id: 'gym-22',
        title: 'Programming Academy',
      }),
    ])
  })
})
