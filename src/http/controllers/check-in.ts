import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MaxTimeToValidateCheckInError } from '@/use-cases/errors/time-expired-to-validate-check-in-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { ValidateCheckInError } from '@/use-cases/errors/validate-check-in-error'
import { makeCreateCheckInUseCase } from '@/use-cases/factories/make-create-check-in-use-case'
import { makeGetNumberTotalCheckInsByUserUseCase } from '@/use-cases/factories/make-get-number-total-check-ins-by-user-use-case'
import { makeGetTotalCheckInsByUserUseCase } from '@/use-cases/factories/make-get-total-check-ins-by-user-use-case'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

export class CheckInController {
  async store(req: FastifyRequest, res: FastifyReply) {
    const schema = z.object({
      userId: z.uuid('User ID is required. Must be a valid UUID.'),
      gymId: z.uuid('Gym ID is required. Must be a valid UUID.'),
      userLatitude: z.coerce.number(
        'User latitude is required. Must be a number.'
      ),
      userLongitude: z.coerce.number(
        'User longitude is required. Must be a number.'
      ),
    })

    const { userId, gymId, userLatitude, userLongitude } = schema.parse(
      req.body
    )

    try {
      const checkInUseCase = makeCreateCheckInUseCase()

      const { checkIn } = await checkInUseCase.execute({
        userId,
        gymId,
        userLatitude,
        userLongitude,
      })

      return res.status(201).send({ checkIn })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).send({
          message: error.message,
        })
      }

      if (error instanceof MaxDistanceError) {
        return res.status(400).send({
          message: error.message,
        })
      }

      if (error instanceof MaxNumberOfCheckInsError) {
        return res.status(400).send({
          message: error.message,
        })
      }

      return res.status(500).send({
        message: 'Internal server error.',
      })
    }
  }

  async showCheckInsCount(req: FastifyRequest, res: FastifyReply) {
    const schema = z.object({
      userId: z.uuid('User ID is invalid.'),
    })

    const { userId } = schema.parse(req.params)

    try {
      const getNumberTotalCheckInsByUserUseCase =
        makeGetNumberTotalCheckInsByUserUseCase()

      const checkInsCount = await getNumberTotalCheckInsByUserUseCase.execute({
        userId,
      })

      return res.status(200).send({
        checkInsCount,
      })
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).send({
          message: error.message,
        })
      }

      return res.status(500).send({
        message: 'Internal server error.',
      })
    }
  }

  async showCheckIns(req: FastifyRequest, res: FastifyReply) {
    const schemaParams = z.object({
      userId: z.uuid('User ID is invalid.'),
    })

    const schemaQuery = z.object({
      page: z.coerce.number().default(1),
    })

    const { userId } = schemaParams.parse(req.params)
    const { page } = schemaQuery.parse(req.query)

    try {
      const getTotalCheckInsByUserUseCase = makeGetTotalCheckInsByUserUseCase()

      const { checkIns } = await getTotalCheckInsByUserUseCase.execute({
        userId,
        page,
      })

      return res.status(200).send({ checkIns })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).send({
          message: error.message,
        })
      }

      return res.status(500).send({
        message: 'Internal server error.',
      })
    }
  }

  async validateCheckIn(req: FastifyRequest, res: FastifyReply) {
    const schema = z.object({
      checkInId: z.string('Check-in ID is invalid.'),
    })

    const { checkInId } = schema.parse(req.params)

    try {
      const validateCheckInUseCase = makeValidateCheckInUseCase()

      const checkInValidated = await validateCheckInUseCase.execute({
        checkInId,
      })

      return res.status(200).send( checkInValidated )
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).send({
          message: error.message,
        })
      }

      if (error instanceof MaxTimeToValidateCheckInError) {
        return res.status(400).send({
          message: error.message,
        })
      }

      if (error instanceof ValidateCheckInError) {
        return res.status(400).send({
          message: error.message,
        })
      }

      return res.status(500).send({
        message: 'Internal server error.',
      })
    }
  }
}
