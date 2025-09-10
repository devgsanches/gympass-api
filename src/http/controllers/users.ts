import { z } from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeCreateUserUseCase } from '@/use-cases/factories/make-create-user-use-case'
import { makeDeleteUserUseCase } from '@/use-cases/factories/make-delete-user-use-case'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { makeGetUsersUseCase } from '@/use-cases/factories/make-get-users-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class UserController {
  async index(req: FastifyRequest, res: FastifyReply) {
    try {
      const getUsersUseCase = makeGetUsersUseCase()

      const users = await getUsersUseCase.execute({})

      res.status(200).send(users)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).send({
          message: error.message,
        })
      }
    }
  }

  async store(req: FastifyRequest, res: FastifyReply) {
    const schema = z.object({
      name: z
        .string('Name is required and must have 3 or more characters.')
        .min(3),
      email: z.email('Invalid email.'),
      password: z
        .string()
        .min(6, 'Password is required and must have 6 or more characters.'),
      role: z.enum(['ADMIN', 'MEMBER']).optional(),
    })

    const { name, email, password, role } = schema.parse(req.body)

    try {
      const createUserUseCase = makeCreateUserUseCase()

      const { user } = await createUserUseCase.execute({
        name,
        email,
        password,
        role,
      })

      res.status(201).send(user)
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return res.status(409).send({
          message: error.message,
        })
      }
    }

    
  }

  async showUserProfile(req: FastifyRequest, res: FastifyReply) {
    try {
      const getUserProfileUseCase = makeGetUserProfileUseCase()

      const { user } = await getUserProfileUseCase.execute({
        id: req.user.sub,
      })

      const { password_hash: _, ...rest } = user

      return res.status(200).send({
        ...rest,
      })
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).send({
          message: error.message,
        })
      }
    }
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    const schema = z.object({
      id: z.string(),
    })

    const { id } = schema.parse(req.params)

    try {
      const deleteUserUseCase = makeDeleteUserUseCase()

      await deleteUserUseCase.execute({ id })
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).send({
          message: error.message,
        })
      }
    }

    res.status(200).send()
  }
}
