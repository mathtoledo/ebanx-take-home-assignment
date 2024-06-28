import { FastifyInstance } from 'fastify'
import { handleEvent } from './controllers/event.controller'
import { handleBalance } from '@/http/controllers/balance.controller'
import { handleReset } from '@/http/controllers/reset.controllet'

export async function appRoutes(app: FastifyInstance) {
  app.post('/reset', handleReset)
  app.post('/event', handleEvent)
  app.get('/balance:account_id', handleBalance)
}
