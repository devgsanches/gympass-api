import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { server } from '@/fastify/app'

// install supertest to E2E tests

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should authenticate the user', async () => {
    await request(server.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const response = await request(server.server).post('/auth/login').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    )
  })
})
