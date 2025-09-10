import type { IUsersRepository } from '@/repositories/interfaces/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { compare } from 'bcryptjs'
import { EmailOrPasswordInvalidError } from './errors/email-or-password-invalid-error'
import jwt from 'jsonwebtoken'
import { env } from '@/env'
import type { User } from 'generated/prisma'

interface IAuthenticateRequest {
  email: string
  password: string
}

type IAuthenticateResponse = {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateRequest): Promise<IAuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new UserNotFoundError()
    }

    const passwordMatch = await compare(password, user.password_hash)

    if (!passwordMatch) {
      throw new EmailOrPasswordInvalidError()
    }

    return {
      user,
    }
  }
}
