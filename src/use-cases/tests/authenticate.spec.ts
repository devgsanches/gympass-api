import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '../authenticate'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { EmailOrPasswordInvalidError } from '../errors/email-or-password-invalid-error'

describe('Authenticate Use Case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateUseCase

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should authenticate successfully', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should fail because the email does not exist', async () => {
    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should fail because the password is incorrect', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(EmailOrPasswordInvalidError)
  })
})
