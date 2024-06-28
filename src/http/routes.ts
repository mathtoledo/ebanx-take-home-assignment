import { FastifyInstance } from 'fastify'
import { handleEvent } from './controllers/event.controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/event', handleEvent)
}
