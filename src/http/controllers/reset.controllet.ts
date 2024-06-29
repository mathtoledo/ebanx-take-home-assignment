import { makeResetUseCase } from '@/use-cases/factories/makeResetUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function handleReset(_: FastifyRequest, reply: FastifyReply) {
  const resetUseCase = makeResetUseCase()

  await resetUseCase.execute()

  return reply.status(200).send('OK')
}
