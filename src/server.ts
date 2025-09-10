import { server } from './fastify/app'
import { env } from './env'

server
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 HTTP server running on port ${env.PORT}.`)
  })
