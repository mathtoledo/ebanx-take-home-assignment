import { InMemoryAccountsRepository } from '@/repositories/in-memory/InMemoryAccountsRepository'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/InMemoryTransactionsRepository'
import { ResetUseCase } from '@/use-cases/Reset.usecase'

export function makeResetUseCase() {
  const accountsRepository = new InMemoryAccountsRepository()
  const transactionsRepository = new InMemoryTransactionsRepository()

  const resetUseCase = new ResetUseCase(accountsRepository, transactionsRepository)

  return resetUseCase
}
