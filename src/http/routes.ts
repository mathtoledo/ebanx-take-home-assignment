import { FastifyInstance } from 'fastify'
import { handleEvent } from './controllers/event.controller'
import { handleBalance } from '@/http/controllers/balance.controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/event', handleEvent)
  app.get('/balance:account_id', handleBalance)
}
