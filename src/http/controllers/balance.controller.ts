import { AccountNotFoundError } from '@/use-cases/errors/AccountNotFoundError'
import { makeBalanceUseCase } from '@/use-cases/factories/makeBalanceUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function handleBalance(request: FastifyRequest, reply: FastifyReply) {
  const balanceSchema = z.object({
    account_id: z.string(),
  })

  const { account_id } = balanceSchema.parse(request.query)

  const balanceUseCase = makeBalanceUseCase()

  try {
    const { balance } = await balanceUseCase.execute({ accountId: account_id })
    return reply.status(200).send(balance)
  } catch (error) {
    if (error instanceof AccountNotFoundError) {
      return reply.status(404).send(0)
    }
  }
}
