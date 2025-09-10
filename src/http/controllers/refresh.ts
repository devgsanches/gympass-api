import type { FastifyReply, FastifyRequest } from 'fastify'

export class RefreshController {
  async refresh(req: FastifyRequest, res: FastifyReply) {
    try {
      await req.jwtVerify({
        onlyCookie: true,
      })

      const token = await res.jwtSign(
        {
          role: req.user.role,
        },
        {
          sign: {
            sub: req.user.sub,
          },
        }
      )

      const refreshToken = await res.jwtSign(
        {
          role: req.user.role,
        },
        {
          sign: {
            sub: req.user.sub,
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
      return res
        .status(401)
        .send({ message: 'Unauthorized. JWT Token is required.' })
    }
  }
}
