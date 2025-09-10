import type { FastifyInstance } from 'fastify'

import { RefreshController } from '@/http/controllers/refresh'

export async function refreshRoute(app: FastifyInstance) {
  const refresh = new RefreshController()

  app.patch('/', refresh.refresh)
}
