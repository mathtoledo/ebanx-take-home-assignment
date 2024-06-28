import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDepositUseCase } from '@/use-cases/factories/makeDepositUseCase'

export async function handleEvent(request: FastifyRequest, reply: FastifyReply) {
  // Schema base para eventos
  const baseEventSchema = z.object({
    type: z.enum(['deposit', 'withdraw', 'transfer']),
  })

  // Schema para depósito
  const depositSchema = baseEventSchema.extend({
    type: z.literal('deposit'),
    destination: z.string(),
    amount: z.number().positive(),
  })

  // Schema para saque
  const withdrawSchema = baseEventSchema.extend({
    type: z.literal('withdraw'),
    origin: z.string(),
    amount: z.number().positive(),
  })

  // Schema para transferência
  const transferSchema = baseEventSchema.extend({
    type: z.literal('transfer'),
    origin: z.string(),
    destination: z.string(),
    amount: z.number().positive(),
  })

  // Schema final que valida os três tipos de evento
  const eventSchema = z.union([depositSchema, withdrawSchema, transferSchema])

  const data = eventSchema.parse(request.body)

  switch (data.type) {
    case 'deposit':
      const depositUseCase = makeDepositUseCase()
      return await depositUseCase.execute(data)
    case 'withdraw':
      console.log('Executing withdraw use case with data:', data)
      break
    case 'transfer':
      console.log('Executing transfer use case with data:', data)
      break
    default:
      throw new Error('Invalid event type')
  }

  return reply.status(201).send({ data })
}
