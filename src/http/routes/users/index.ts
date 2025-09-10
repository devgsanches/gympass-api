import type { FastifyInstance } from 'fastify'

import { UserController } from '@/http/controllers/users'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  const users = new UserController()

  app.get('/', { preHandler: [verifyJwt] }, users.index)
  app.get('/me', { preHandler: [verifyJwt] }, users.showUserProfile)
  app.post('/', users.store)
  app.delete('/:id', { preHandler: [verifyJwt] }, users.delete)
}
