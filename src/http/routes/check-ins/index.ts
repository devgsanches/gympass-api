import type { FastifyInstance } from 'fastify'

import { CheckInController } from '@/http/controllers/check-in'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  const checkIn = new CheckInController()

  app.addHook('onRequest', verifyJwt)

  app.post('/', checkIn.store)
  app.get('/:userId/count', checkIn.showCheckInsCount)
  app.get('/:userId', checkIn.showCheckIns)
  app.patch(
    '/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    checkIn.validateCheckIn
  )
}
