import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetTotalCheckInsByUserUseCase } from '../get-total-check-ins-by-user'

describe('Get Total Check-ins By User Use Case', () => {
  let usersRepository: InMemoryUsersRepository
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: GetTotalCheckInsByUserUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    usersRepository = new InMemoryUsersRepository()

    // para por ex, usar meu caso de uso em algum controller, teria que instanciar tanto o usersRepository quanto o checkInsRepository, e para evitar essa redundância de código, crio um factory.

    // sut é um nome para
    sut = new GetTotalCheckInsByUserUseCase(usersRepository, checkInsRepository)
  })

  it('should get the total check-ins of a user', async () => {
    // create a user
    const { id } = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await checkInsRepository.create({
      userId: id,
      gymId: 'gym-01',
      createdAt: new Date(),
    })

    await checkInsRepository.create({
      userId: id,
      gymId: 'gym-02',
      createdAt: new Date(),
    })

    const { checkIns } = await sut.execute({
      userId: id,
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-01' }),
      expect.objectContaining({ gymId: 'gym-02' }),
    ])
  })

  it('should get the total check-ins of a user with pagination', async () => {
    // create a user
    const { id } = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        userId: id,
        gymId: `gym-${i}`,
        createdAt: new Date(),
      })
    }

    // perPage > 20
    const { checkIns } = await sut.execute({
      userId: id,
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-21' }),
      expect.objectContaining({ gymId: 'gym-22' }),
    ])
  })
})
