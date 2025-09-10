import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { server } from '@/fastify/app'
import { createAUserAndAuthenticate } from '@/utils/create-a-user-and-authenticate'

// install supertest to E2E tests

describe('Users (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should create a user', async () => {
    const response = await request(server.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe2@example.com',
      password: '123456',
    })

    expect(response.status).toEqual(201)
  })

  it('should list users', async () => {
    const { token } = await createAUserAndAuthenticate(server)

    await request(server.server).post('/users').send({
      name: 'Jeff Bezos',
      email: 'jeff.bezos@example.com',
      password: '123456',
    })

    const response = await request(server.server)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        users: expect.arrayContaining([
          expect.objectContaining({
            name: 'John Doe',
          }),
          expect.objectContaining({
            name: 'Jeff Bezos',
          }),
        ]),
      })
    )
  })

  it('should get user information', async () => {
    const { token } = await createAUserAndAuthenticate(server)

    const response = await request(server.server)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      })
    )
  })

  it('should delete a user', async () => {
    const { token, user } = await createAUserAndAuthenticate(server)

    const response = await request(server.server)
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
  })
})
