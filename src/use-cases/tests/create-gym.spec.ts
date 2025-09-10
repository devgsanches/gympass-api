import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { CreateGymUseCase } from '../create-gym'

describe('Creater User Use Case', () => {
  let gymsRepository: InMemoryGymRepository
  let sut: CreateGymUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Programming Academy',
      latitude: -23.4892139,
      longitude: -46.3254991,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
