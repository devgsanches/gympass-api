import type { FastifyInstance } from 'fastify'

import { AuthenticateController } from '@/http/controllers/authenticate'

export async function authRoutes(app: FastifyInstance) {
  const auth = new AuthenticateController()

  app.post('/login', auth.signIn)
}
