import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile-use-case'
import { UserNotFoundError } from '../errors/user-not-found-error'

describe('Get User Profile Use Case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should get user information with success', async () => {
    const { id } = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      id,
    })

    expect(user.id).toEqual(id)
    expect(user.name).toEqual('John Doe')
  })

  it('should give an error because the user does not exist', async () => {
    const id = 'non-existing-id'

    await expect(() => sut.execute({ id })).rejects.toBeInstanceOf(
      UserNotFoundError
    )
  })
})
