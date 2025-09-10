import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { server } from '@/fastify/app'
import { createAUserAndAuthenticate } from '@/utils/create-a-user-and-authenticate'

// install supertest to E2E tests

describe('Gym (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should create a gym', async () => {
    const { token } = await createAUserAndAuthenticate(server, true)

    const response = await request(server.server)
      .post('/gyms')
      .send({
        title: 'JavaScript Gym',
        latitude: -23.4373105,
        longitude: -46.1137987,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(201)
  })

  it('should not create a gym if user is not admin', async () => {
    const { token } = await createAUserAndAuthenticate(server)

    const response = await request(server.server)
      .post('/gyms')
      .send({
        title: 'JavaScript Gym',
        latitude: -23.4373105,
        longitude: -46.1137987,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(401)
    expect(response.body).toEqual({
      message: 'Unauthorized.',
    })
  })

  it('should list gyms nearby', async () => {
    const { token } = await createAUserAndAuthenticate(server, true)

    await request(server.server)
      .post('/gyms')
      .send({
        title: 'JavaScript Gym',
        latitude: -23.4373772,
        longitude: -46.114169,
      })
      .set('Authorization', `Bearer ${token}`)

    await request(server.server)
      .post('/gyms')
      .send({
        title: 'TypeScript Gym',
        latitude: -23.4497135,
        longitude: -46.2352033,
      })
      .set('Authorization', `Bearer ${token}`)

    const response = await request(server.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.4373772,
        longitude: -46.114169,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        gyms: expect.arrayContaining([
          expect.objectContaining({
            title: 'JavaScript Gym',
          }),
        ]),
      })
    )
  })

  it('should list gyms by query', async () => {
    const { token } = await createAUserAndAuthenticate(server, true)

    await request(server.server)
      .post('/gyms')
      .send({
        title: 'PostgreSQL Gym',
        latitude: -23.4373772,
        longitude: -46.114169,
      })
      .set('Authorization', `Bearer ${token}`)

    await request(server.server)
      .post('/gyms')
      .send({
        title: 'MongoDB Gym',
        latitude: -23.4373772,
        longitude: -46.114169,
      })
      .set('Authorization', `Bearer ${token}`)

    const response = await request(server.server)
      .get('/gyms')
      .query({ query: 'mongodb' })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body).toEqual(
      expect.objectContaining({
        gyms: expect.arrayContaining([
          expect.objectContaining({
            title: 'MongoDB Gym',
          }),
        ]),
      })
    )
  })
})
