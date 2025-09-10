import { GymNotFoundError } from '@/use-cases/errors/gym-not-found-error'
import { NoGymsNearbyError } from '@/use-cases/errors/no-gyms-nearby-error'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { makeGetNearbyGymsUseCase } from '@/use-cases/factories/make-get-nearby-gym-use-case'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

export class GymController {
  async store(req: FastifyRequest, res: FastifyReply) {
    const schema = z.object({
      title: z.string('Title is required.'),
      description: z.string().optional(),
      phone: z.string().optional(),
      latitude: z.number('Latitude must be a number.'),
      longitude: z.number('Longitude must be a number.'),
    })

    const { title, description, phone, latitude, longitude } = schema.parse(
      req.body
    )

    try {
      const createGymUseCase = makeCreateGymUseCase()

      const { gym } = await createGymUseCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude,
      })

      return res.status(201).send({ gym })
    } catch (error) {
      return res.status(500).send({
        message: 'Internal server error.',
      })
    }
  }

  async showGyms(req: FastifyRequest, res: FastifyReply) {
    const schema = z.object({
      query: z.string().optional(),
      page: z.coerce.number().default(1),
    })

    const { query, page } = schema.parse(req.query)

    try {
      const searchGymsUseCase = makeSearchGymsUseCase()

      const gyms = await searchGymsUseCase.execute({
        query: query ? query : '',
        page,
      })

      return res.status(200).send(gyms)
    } catch (error) {
      if (error instanceof GymNotFoundError) {
        return res.status(404).send({
          message: error.message,
        })
      }

      return res.status(500).send({
        message: 'Internal server error.',
      })
    }
  }

  async showGymsNearby(req: FastifyRequest, res: FastifyReply) {
    const schema = z.object({
      latitude: z.coerce.number('Latitude is required. Must be a number.'),
      longitude: z.coerce.number('Longitude is required. Must be a number.'),
      page: z.coerce.number().default(1),
    })

    const { latitude, longitude, page } = schema.parse(req.query)

    try {
      const getNearbyGymsUseCase = makeGetNearbyGymsUseCase()

      const gyms = await getNearbyGymsUseCase.execute({
        latitude,
        longitude,
        page,
      })

      return res.status(200).send(gyms)
    } catch (error) {
      if (error instanceof NoGymsNearbyError) {
        return res.status(404).send({
          message: error.message,
        })
      }

      return res.status(500).send({
        message: 'Internal server error.',
      })
    }
  }
}
