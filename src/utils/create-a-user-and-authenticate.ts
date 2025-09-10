import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import request from 'supertest'

export async function createAUserAndAuthenticate(
  server: FastifyInstance,
  isAdmin = false
) {
  const email = `john.doe${randomUUID()}@example.com`

  const user = await request(server.server)
    .post('/users')
    .send({
      name: 'John Doe',
      email,
      password: '123456',
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    })

  const response = await request(server.server).post('/auth/login').send({
    email,
    password: '123456',
  })

  const { token } = response.body

  return {
    user: user.body,
    token,
  }
}
