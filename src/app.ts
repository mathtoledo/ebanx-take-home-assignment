import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

// Hack to delete content-type for the /reset request: https://fastify.dev/docs/latest/Reference/Errors/#fst_err_ctp_empty_json_body
app.addHook('onRequest', (request, _reply, done) => {
  const method = request.raw.method
  const url = request.url

  if (method === 'POST' && url.startsWith('/reset')) {
    delete request.headers['content-type']
  }

  done()
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation Error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
