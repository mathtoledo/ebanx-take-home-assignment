import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDepositUseCase } from '@/use-cases/factories/makeDepositUseCase'
import { makeWithdrawUseCase } from '@/use-cases/factories/makeWithdrawUseCase'
import { AccountNotFoundError } from '@/use-cases/errors/AccountNotFoundError'
import { AccountBalanceLessThanWithdrawAmountError } from '@/use-cases/errors/AccountBalanceLessThanWithdrawAmountError'
import { makeTransferUseCase } from '@/use-cases/factories/makeTransferUseCase'
import { AccountBalanceLessThanTransferAmountError } from '@/use-cases/errors/AccountBalanceLessThanTransferAmountError'

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
      const response = await depositUseCase.execute(data)
      return reply.status(201).send(response)
    case 'withdraw':
      try {
        const withdrawUseCase = makeWithdrawUseCase()
        const response = await withdrawUseCase.execute(data)
        return reply.status(201).send(response)
      } catch (error) {
        if (error instanceof AccountNotFoundError) {
          return reply.status(404).send(0)
        }
        if (error instanceof AccountBalanceLessThanWithdrawAmountError) {
          return reply.status(409).send({ message: error.message })
        }
        throw error
      }
    case 'transfer':
      try {
        const transferUseCase = makeTransferUseCase()
        const response = await transferUseCase.execute(data)
        return reply.status(201).send(response)
      } catch (error) {
        if (error instanceof AccountNotFoundError) {
          return reply.status(404).send(0)
        }
        if (error instanceof AccountBalanceLessThanTransferAmountError) {
          return reply.status(409).send({ message: error.message })
        }
        throw error
      }
    default:
      throw new Error('Invalid event type')
  }
}
