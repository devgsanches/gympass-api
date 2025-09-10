import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetNumberTotalCheckInsByUserUseCase } from '../get-number-total-check-ins-by-user'

describe('Get Total Check-ins By User Use Case', () => {
  let usersRepository: InMemoryUsersRepository
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: GetNumberTotalCheckInsByUserUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    usersRepository = new InMemoryUsersRepository()

    // para por ex, usar meu caso de uso em algum controller, teria que instanciar tanto o usersRepository quanto o checkInsRepository, e para evitar essa redundância de código, crio um factory.

    // sut é um nome para
    sut = new GetNumberTotalCheckInsByUserUseCase(
      usersRepository,
      checkInsRepository
    )
  })

  it('should get the total number of check-ins of a user', async () => {
    // create a user
    const { id } = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 10; i++) {
      await checkInsRepository.create({
        userId: id,
        gymId: `gym-${i}`,
        createdAt: new Date(),
      })
    }

    const checkInsCount = await sut.execute({
      userId: id,
    })

    expect(checkInsCount).toBe(10)
  })
})
