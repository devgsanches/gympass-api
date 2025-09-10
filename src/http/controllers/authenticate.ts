import { EmailOrPasswordInvalidError } from '@/use-cases/errors/email-or-password-invalid-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export class AuthenticateController {
  async signIn(req: FastifyRequest, res: FastifyReply) {
    const schema = z.object({
      email: z.email('Invalid email.'),
      password: z.string('Password is required.'),
    })

    const { email, password } = schema.parse(req.body)

    try {
      const authenticateUseCase = makeAuthenticateUseCase()

      const { user } = await authenticateUseCase.execute({
        email,
        password,
      })

      const token = await res.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            sub: user.id,
          },
        }
      )

      const refreshToken = await res.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            sub: user.id,
            expiresIn: '7d',
          },
        }
      )

      return res
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send({
          token,
        })
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).send({
          message: error.message,
        })
      }

      if (error instanceof EmailOrPasswordInvalidError) {
        return res.status(401).send({
          message: error.message,
        })
      }
    }
  }
}
