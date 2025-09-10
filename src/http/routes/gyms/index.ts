import type { FastifyInstance } from 'fastify'

import { GymController } from '@/http/controllers/gym'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  const gym = new GymController()

  app.addHook('onRequest', verifyJwt)

  app.post('/', { onRequest: [verifyUserRole('ADMIN')] }, gym.store)
  app.get('/', gym.showGyms)
  app.get('/nearby', gym.showGymsNearby)
}
