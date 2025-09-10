import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { server } from '@/fastify/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

// install supertest to E2E tests

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('must create a token and refresh token', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const authResponse = await request(server.server).post('/auth/login').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(server.server)
      .patch('/token/refresh')
      .set('Cookie', cookies!)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    )
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
