import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { server } from '@/fastify/app'
import { createAUserAndAuthenticate } from '@/utils/create-a-user-and-authenticate'
import { prisma } from '@/lib/prisma'

// install supertest to E2E tests

describe('Check-in (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should create a check-in', async () => {
    const { token, user } = await createAUserAndAuthenticate(server)

    const gym = await prisma.gym.create({
      data: {
        title: 'Programming Academy',
        latitude: -23.4892139,
        longitude: -46.3254991,
      },
    })

    const responseCheckIn = await request(server.server)
      .post('/check-ins')
      .send({
        gymId: gym.id,
        userId: user.id,
        userLatitude: -23.4892139,
        userLongitude: -46.3254991,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(responseCheckIn.status).toEqual(201)
  })

  it('should return a check-in count', async () => {
    const { token, user } = await createAUserAndAuthenticate(server)

    const gym = await prisma.gym.create({
      data: {
        title: 'Programming Academy',
        latitude: -23.4892139,
        longitude: -46.3254991,
      },
    })

    await prisma.checkIn.create({
      data: {
        gymId: gym.id,
        userId: user.id,
      },
    })

    const responseCheckInCount = await request(server.server)
      .get(`/check-ins/${user.id}/count`)
      .set('Authorization', `Bearer ${token}`)

    expect(responseCheckInCount.status).toEqual(200)
    expect(responseCheckInCount.body).toEqual(
      expect.objectContaining({
        checkInsCount: 1,
      })
    )
  })

  it('should return a history of check-ins', async () => {
    const { token, user } = await createAUserAndAuthenticate(server)

    const gym = await prisma.gym.create({
      data: {
        title: 'Programming Academy',
        latitude: -23.4892139,
        longitude: -46.3254991,
      },
    })

    await prisma.checkIn.create({
      data: {
        gymId: gym.id,
        userId: user.id,
      },
    })

    const responseCheckIns = await request(server.server)
      .get(`/check-ins/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(responseCheckIns.status).toEqual(200)
    expect(responseCheckIns.body).toEqual(
      expect.objectContaining({
        checkIns: expect.arrayContaining([
          expect.objectContaining({
            gymId: gym.id,
            userId: user.id,
          }),
        ]),
      })
    )
  })

  it('should a validate a check-in', async () => {
    const { token, user } = await createAUserAndAuthenticate(server, true)

    const gym = await prisma.gym.create({
      data: {
        title: 'Programming Academy',
        latitude: -23.4892139,
        longitude: -46.3254991,
      },
    })

    const checkIn = await prisma.checkIn.create({
      data: {
        userId: user.id,
        gymId: gym.id,
      },
    })

    const checkInValidatedResponse = await request(server.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)

    const dateValidated =
      checkInValidatedResponse.body.checkInValidated.validatedAt

    expect(checkInValidatedResponse.status).toEqual(200)
    expect(new Date(dateValidated)).toEqual(expect.any(Date))
  })

  it('should not a validate a check-in if user is not admin', async () => {
    const { token, user } = await createAUserAndAuthenticate(server)

    const gym = await prisma.gym.create({
      data: {
        title: 'Programming Academy',
        latitude: -23.4892139,
        longitude: -46.3254991,
      },
    })

    const checkIn = await prisma.checkIn.create({
      data: {
        userId: user.id,
        gymId: gym.id,
      },
    })

    const checkInValidatedResponse = await request(server.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)

    expect(checkInValidatedResponse.status).toEqual(401)
    expect(checkInValidatedResponse.body).toEqual({
      message: 'Unauthorized.',
    })
  })
})
