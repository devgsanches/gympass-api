import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'
import { appRoutes } from '../http/routes'
import { ZodError } from 'zod'
import { env } from '@/env'

export const server = fastify()

server.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})
server.register(fastifyCookie)

server.register(appRoutes)

server.setErrorHandler((error, _, response) => {
  if (error instanceof ZodError) {
    return response.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return response.status(500).send({
    message: 'Internal server error.',
  })
})
