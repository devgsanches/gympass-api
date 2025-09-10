import type { FastifyInstance } from 'fastify'

import { authRoutes } from './auth'
import { usersRoutes } from './users'
import { gymsRoutes } from './gyms'
import { checkInsRoutes } from './check-ins'

import { refreshRoute } from './refresh'

export async function appRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' })
  app.register(usersRoutes, { prefix: '/users' })

  app.register(refreshRoute, { prefix: '/token/refresh' })

  app.register(gymsRoutes, { prefix: '/gyms' })
  app.register(checkInsRoutes, { prefix: '/check-ins' })
}
