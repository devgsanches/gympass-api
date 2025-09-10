import type { IUsersRepository } from '@/repositories/interfaces/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import type { User } from 'generated/prisma'

interface ICreateUser {
  name: string
  email: string
  password: string
  role?: 'ADMIN' | 'MEMBER'
}

interface ICreateUserResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
    role,
  }: ICreateUser): Promise<ICreateUserResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role,
    })

    return {
      user,
    }
  }
}
